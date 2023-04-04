import { isAuthenticated } from "$lib/utils/server/authorization"
import dateRangeResponse from "$lib/utils/server/dateRangeResponse"
import { GraphQLError } from "graphql"

export default async function handler(parent, args, context) {
  // Permissions
  isAuthenticated(context.user)

  const authUser = await context.prisma.user.findUnique({
    where: {
      email: context.user.email
    },
    select: {
      id: true
    }
  })

  let { startDate } = args

  if (!startDate) {
    // get the oldest transaction date
    const oldestTransaction = await context.prisma.transaction.findFirst({
      orderBy: {
        date: `asc`
      },
      select: {
        date: true
      }
    })
    startDate = oldestTransaction.date
  }
  const { response } = dateRangeResponse(startDate, args.endDate)

  // get all transactions for the user and group by month and year and then sub-group by account
  const transactions = await context.prisma.transaction.findMany({
    where: {
      userId: authUser.id,
      date: {
        lte: new Date()
      }
    },
    select: {
      amount: true,
      accountId: true,
      date: true
    },
    orderBy: {
      date: `asc`
    }
  })

  const accountsMap = (
    await context.prisma.account.findMany({
      where: {
        userId: authUser.id
      },
      select: {
        id: true,
        name: true
      },
      orderBy: [
        {
          accountType: {
            priority: `asc`
          }
        },
        { name: `asc` }
      ]
    })
  ).reduce((acc, account) => {
    acc[account.id] = account.name
    return acc
  }, {})

  // loop through the date range and add the transactions to the response
  response.forEach((dateRange) => {
    const transactionsForDateRange = transactions.filter((transaction) => {
      return transaction.date < dateRange.endDate
    })

    // loop through the transactions and add them to the response
    transactionsForDateRange.forEach((transaction) => {
      const account = accountsMap[transaction.accountId]
      if (!dateRange[account]) {
        dateRange[account] = 0
      }
      dateRange[account] = parseFloat(
        parseFloat(dateRange[account]) + parseFloat(transaction.amount)
      ).toFixed(2)
    })
  })

  // loop through the response and add the total for each date range
  response.forEach((dateRange) => {
    dateRange.total = Object.keys(dateRange)
      .filter((key) => key !== `startDate` && key !== `endDate` && key !== `day`)
      .reduce((acc, key) => {
        return parseFloat(acc) + parseFloat(dateRange[key])
      }, 0)
      .toFixed(2)
    // delete the startDate and endDate
    delete dateRange.startDate
    delete dateRange.endDate
  })

  // construct the table response
  const table = {
    labels: [`Account`, ...response.map((dateRange) => dateRange.day)],
    rows: []
  }
  // add the total row
  table.rows.push([`Net Worth`, ...response.map((dateRange) => dateRange.total)])

  Object.keys(accountsMap).forEach((accountId) => {
    const account = accountsMap[accountId]
    const row = [account, ...response.map((dateRange) => dateRange[account] || 0)]
    table.rows.push(row)
  })

  // remove rows that are all 0
  table.rows = table.rows.filter((row) =>
    row.slice(1, row.length - 1).some((value) => parseFloat(value) !== 0)
  )

  // check if there is at least one row with a value
  if (
    table.rows.every((row) =>
      row.slice(1, row.length - 1).every((value) => parseFloat(value) === 0)
    )
  ) {
    throw new GraphQLError(`No data for the selected date range`)
  }

  return {
    table,
    context: {
      months: response.map((dateRange) => dateRange.day),
      rows: table.rows.slice(1).map((row) => row[0]),
      identifier: `account`
    }
  }
}
