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
      userId: authUser.id
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
      return transaction.date >= dateRange.startDate && transaction.date < dateRange.endDate
    })

    // loop through the transactions and add them to the response
    transactionsForDateRange.forEach((transaction) => {
      const account = accountsMap[transaction.accountId]
      if (!dateRange[account]) {
        dateRange[account] = 0
      }
      dateRange[account] = parseFloat(dateRange[account]) + parseFloat(transaction.amount)
    })
  })

  // loop through the response and add the total for each date range
  response.forEach((dateRange) => {
    dateRange.total = Object.keys(dateRange)
      .filter((key) => key !== `startDate` && key !== `endDate` && key !== `day`)
      .reduce((acc, key) => {
        return acc + dateRange[key]
      }, 0)
    // delete the startDate and endDate
    delete dateRange.startDate
    delete dateRange.endDate
  })

  // construct the chart response
  const chart = {
    labels: response.map((dateRange) => dateRange.day),
    datasets: [
      ...Object.keys(accountsMap)
        .map((accountId) => {
          return {
            name: accountsMap[accountId],
            values: response.map((dateRange) => dateRange[accountsMap[accountId]] || 0),
            chartType: `bar`
          }
        })
        .filter((dataset) => dataset.values.some((value) => value !== 0)),
      {
        name: `Net Worth`,
        values: response.map((dateRange) => dateRange.total),
        chartType: `line`
      }
    ]
  }

  // construct the table response
  const table = {
    labels: [`Payee`, ...response.map((dateRange) => dateRange.day), `Total`],
    rows: []
  }
  Object.keys(accountsMap).forEach((accountId) => {
    const account = accountsMap[accountId]
    const row = [account, ...response.map((dateRange) => dateRange[account] || 0), 0]
    row[row.length - 1] = row.slice(1, row.length - 1).reduce((acc, value) => acc + value, 0) // Total
    table.rows.push(row)
  })
  // add the total row
  table.rows.push([
    `Net Worth`,
    ...response.map((dateRange) => dateRange.total),
    response.reduce((acc, dateRange) => acc + dateRange.total, 0)
  ])

  // check if there is at least one row with a value
  if (table.rows.every((row) => row.slice(1, row.length - 1).every((value) => value === 0))) {
    throw new GraphQLError(`No data for the selected date range`)
  }

  return {
    chart,
    table
  }
}
