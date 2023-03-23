import { isAuthenticated } from "$lib/utils/server/authorization"

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

  const { startDate, endDate } = args

  const categoriesMap = (
    await context.prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: {
        name: `asc`
      }
    })
  ).reduce((acc, curr) => {
    acc[curr.id] = curr.name
    return acc
  }, {})

  // aggregate the transactions into income and expense by categories in the date range
  const categoriesIncomeReport = await context.prisma.transaction.groupBy({
    by: [`categoryId`],
    _sum: {
      amount: true
    },
    where: {
      userId: authUser.id,
      date: {
        gte: startDate,
        lte: endDate
      },
      amount: {
        gte: 0
      }
    }
  })

  const categoriesExpenseReport = await context.prisma.transaction.groupBy({
    by: [`categoryId`],
    _sum: {
      amount: true
    },
    where: {
      userId: authUser.id,
      date: {
        gte: startDate,
        lte: endDate
      },
      amount: {
        lt: 0
      }
    }
  })

  const incomeData = []
  const expenseData = []
  const netData = []
  for (const categoryId of Object.keys(categoriesMap)) {
    const income = categoriesIncomeReport.find((income) => income.categoryId === categoryId)
    incomeData.push(income ? parseFloat(income._sum.amount).toFixed(2) : parseFloat(0).toFixed(2))

    const expense = categoriesExpenseReport.find((expense) => expense.categoryId === categoryId)
    expenseData.push(
      expense ? parseFloat(expense._sum.amount * -1).toFixed(2) : parseFloat(0).toFixed(2)
    )

    netData.push(
      parseFloat(
        parseFloat(income ? income._sum.amount : 0) + parseFloat(expense ? expense._sum.amount : 0)
      ).toFixed(2)
    )
  }

  // construct the chart response
  const chart = {
    labels: Object.values(categoriesMap),
    datasets: [
      {
        name: `Income`,
        values: incomeData,
        chartType: `bar`,
        colors: [`#00b894`]
      },
      {
        name: `Expense`,
        values: expenseData,
        chartType: `bar`,
        colors: [`#ff5252`]
      }
    ]
  }

  // construct the table response
  const table = {
    labels: [`Account`, `Income`, `Expense`, `Net`],
    rows: []
  }
  for (const categoryId of Object.keys(categoriesMap)) {
    const income = categoriesIncomeReport.find((income) => income.categoryId === categoryId)
    const expense = categoriesExpenseReport.find((expense) => expense.categoryId === categoryId)
    table.rows.push([
      categoriesMap[categoryId],
      income ? parseFloat(income._sum.amount).toFixed(2) : parseFloat(0).toFixed(2),
      expense ? parseFloat(expense._sum.amount).toFixed(2) : parseFloat(0).toFixed(2),
      parseFloat(
        parseFloat(income ? income._sum.amount : 0) + parseFloat(expense ? expense._sum.amount : 0)
      ).toFixed(2)
    ])
  }
  // add the total row
  table.rows.push([
    `TOTAL`,
    parseFloat(
      categoriesIncomeReport.reduce((acc, curr) => acc + parseFloat(curr._sum.amount), 0)
    ).toFixed(2),
    parseFloat(
      categoriesExpenseReport.reduce((acc, curr) => acc + parseFloat(curr._sum.amount), 0)
    ).toFixed(2),
    parseFloat(
      categoriesIncomeReport.reduce((acc, curr) => acc + parseFloat(curr._sum.amount), 0) +
        categoriesExpenseReport.reduce((acc, curr) => acc + parseFloat(curr._sum.amount), 0)
    ).toFixed(2)
  ])

  return {
    chart,
    table
  }
}
