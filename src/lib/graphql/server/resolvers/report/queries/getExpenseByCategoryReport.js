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

  // get all transactions for the user and group by month and year and then sub-group by category
  let transactions = await context.prisma.transaction.findMany({
    where: {
      userId: authUser.id,
      transferId: {
        equals: null
      },
      amount: {
        lt: 0
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

  const categoriesMap = (
    await context.prisma.category.findMany({
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
  ).reduce((acc, category) => {
    acc[category.id] = category.name
    return acc
  }, {})

  // loop through the date range and add the transactions to the response
  response.forEach((dateRange) => {
    const transactionsForDateRange = transactions.filter((transaction) => {
      return transaction.date >= dateRange.startDate && transaction.date < dateRange.endDate
    })

    // loop through the transactions and add them to the response
    transactionsForDateRange.forEach((transaction) => {
      const category = categoriesMap[transaction.categoryId]
      if (!dateRange[category]) {
        dateRange[category] = 0
      }
      dateRange[category] = parseFloat(dateRange[category]) + parseFloat(transaction.amount * -1)
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
      ...Object.keys(categoriesMap)
        .map((categoryId) => {
          return {
            name: categoriesMap[categoryId],
            values: response.map((dateRange) => dateRange[categoriesMap[categoryId]] || 0),
            chartType: `bar`
          }
        })
        .filter((dataset) => dataset.values.some((value) => value !== 0)),
      {
        name: `Total`,
        values: response.map((dateRange) => dateRange.total),
        chartType: `line`
      }
    ]
  }

  // construct the table response
  const table = {
    labels: [`Category`, ...response.map((dateRange) => dateRange.day), `Total`, `Average`],
    rows: []
  }
  Object.keys(categoriesMap).forEach((categoryId) => {
    const category = categoriesMap[categoryId]
    const row = [category, ...response.map((dateRange) => dateRange[category] * -1 || 0), 0, 0]
    // remove rows that are all 0
    if (row.slice(1, row.length - 2).every((value) => value === 0)) {
      return
    }
    row[row.length - 2] = row.slice(1, row.length - 1).reduce((acc, value) => acc + value, 0) // Total
    row[row.length - 1] = row[row.length - 2] / response.length // Average
    table.rows.push(row)
  })
  // add the total row
  table.rows.push([
    `Total`,
    ...response.map((dateRange) => dateRange.total * -1),
    response.reduce((acc, dateRange) => acc + dateRange.total * -1, 0),
    response.reduce((acc, dateRange) => acc + dateRange.total * -1, 0) / response.length
  ])

  // check if there is at least one row with a value
  if (table.rows.every((row) => row.slice(1, row.length - 2).every((value) => value === 0))) {
    throw new GraphQLError(`No data for the selected date range`)
  }

  return {
    chart,
    table
  }
}