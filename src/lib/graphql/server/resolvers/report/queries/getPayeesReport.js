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

  // get all transactions for the user and group by month and year and then sub-group by payee
  let transactions = await context.prisma.transaction.findMany({
    where: {
      userId: authUser.id,
      date: {
        lte: new Date()
      },
      transferId: {
        equals: null
      }
    },
    select: {
      amount: true,
      payeeId: true,
      categoryId: true,
      transferId: true,
      date: true
    },
    orderBy: {
      date: `asc`
    }
  })

  // filter out opening balances
  transactions = transactions.filter((transaction) => {
    return !(!transaction.payeeId && !transaction.categoryId && !transaction.transferId)
  })

  const payeesMap = (
    await context.prisma.payee.findMany({
      where: {
        userId: authUser.id
      },
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: `asc`
      }
    })
  ).reduce((acc, payee) => {
    acc[payee.id] = payee.name
    return acc
  }, {})

  // loop through the date range and add the transactions to the response
  response.forEach((dateRange) => {
    const transactionsForDateRange = transactions.filter((transaction) => {
      return transaction.date >= dateRange.startDate && transaction.date < dateRange.endDate
    })

    // loop through the transactions and add them to the response
    transactionsForDateRange.forEach((transaction) => {
      const payee = payeesMap[transaction.payeeId]
      if (!dateRange[payee]) {
        dateRange[payee] = 0
      }
      dateRange[payee] = parseFloat(dateRange[payee]) + parseFloat(transaction.amount)
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

  // construct the table response
  const table = {
    labels: [`Payee`, ...response.map((dateRange) => dateRange.day), `Average`],
    rows: []
  }
  // add the total row
  table.rows.push([
    `Net`,
    ...response.map((dateRange) => dateRange.total),
    parseFloat(
      parseFloat(response.reduce((acc, dateRange) => acc + dateRange.total, 0)) /
        parseFloat(response.length)
    ).toFixed(2)
  ])

  Object.keys(payeesMap).forEach((payeeId) => {
    const payee = payeesMap[payeeId]
    const row = [payee, ...response.map((dateRange) => dateRange[payee] || 0), 0]
    // remove rows that are all 0
    if (row.slice(1, row.length - 1).every((value) => value === 0)) {
      return
    }
    // calculate the average
    row[row.length - 1] = parseFloat(
      parseFloat(row.slice(1, row.length - 1).reduce((acc, value) => acc + value, 0)) /
        parseFloat(row.length - 2)
    ).toFixed(2)
    table.rows.push(row)
  })

  // check if there is at least one row with a value
  if (table.rows.every((row) => row.slice(1, row.length - 1).every((value) => value === 0))) {
    throw new GraphQLError(`No data for the selected date range`)
  }

  return {
    table,
    context: {
      months: response.map((dateRange) => dateRange.day),
      rows: table.rows.slice(1).map((row) => row[0]),
      identifier: `payee`
    }
  }
}
