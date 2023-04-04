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

  // get the latest transaction date (from future transactions)
  const latestTransaction = await context.prisma.transaction.findFirst({
    where: {
      userId: authUser.id,
      date: {
        gte: new Date()
      }
    },
    select: {
      date: true
    },
    orderBy: {
      date: `desc`
    }
  })

  const endDate = latestTransaction ? latestTransaction.date : new Date()

  const { response } = dateRangeResponse(new Date(), endDate)

  // get all future transactions for the user and group by month and year and then sub-group by account
  const futureTransactions = await context.prisma.transaction.findMany({
    where: {
      userId: authUser.id,
      date: {
        gt: new Date()
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

  const currentTransactions = await context.prisma.transaction.findMany({
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
    const transactionsForDateRange = futureTransactions.filter((transaction) => {
      return transaction.date < dateRange.endDate && transaction.date >= dateRange.startDate
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

  // construct the table response
  const table = {
    labels: [
      `Account`,
      `Current Balance`,
      ...response.map((dateRange) => dateRange.day),
      `Forecasted Balance`
    ],
    rows: []
  }

  const currentTransactionsTotal = currentTransactions.reduce((acc, transaction) => {
    return acc + transaction.amount
  }, 0)
  // add the total row
  table.rows.push([
    `Net Worth`,
    currentTransactionsTotal,
    ...response.map((dateRange) => dateRange.total),
    response.reduce((acc, dateRange) => {
      return acc + dateRange.total
    }, currentTransactionsTotal)
  ])

  Object.keys(accountsMap).forEach((accountId) => {
    const account = accountsMap[accountId]
    const currentAccountBalance = currentTransactions
      .filter((transaction) => transaction.accountId === accountId)
      .reduce((acc, transaction) => {
        return acc + transaction.amount
      }, 0)
    const forecastedAccountBalance = response.reduce((acc, dateRange) => {
      return acc + dateRange[account] || 0
    }, currentAccountBalance)
    const row = [
      account,
      currentAccountBalance,
      ...response.map((dateRange) => dateRange[account] || 0),
      forecastedAccountBalance
    ]
    table.rows.push(row)
  })

  // check if there is at least one row with a value
  if (table.rows.every((row) => row.slice(1, row.length).every((value) => value === 0))) {
    throw new GraphQLError(`No data for the selected date range`)
  }

  // remove rows with all zeros
  table.rows = table.rows.filter((row) => row.slice(2, row.length).some((value) => value !== 0))

  return {
    table,
    context: {
      months: response.map((dateRange) => dateRange.day),
      rows: table.rows.slice(1).map((row) => row[0]),
      identifier: `account`
    }
  }
}
