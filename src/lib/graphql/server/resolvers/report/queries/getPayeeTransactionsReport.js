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

  const payeesMap = (
    await context.prisma.payee.findMany({
      select: { id: true, name: true },
      orderBy: {
        name: `asc`
      }
    })
  ).reduce((acc, curr) => {
    acc[curr.id] = curr.name
    return acc
  }, {})

  // aggregate the transactions into income and expense by payees in the date range
  const payeesIncomeReport = await context.prisma.transaction.groupBy({
    by: [`payeeId`],
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

  const payeesExpenseReport = await context.prisma.transaction.groupBy({
    by: [`payeeId`],
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
  for (const payeeId of Object.keys(payeesMap)) {
    const income = payeesIncomeReport.find((income) => income.payeeId === payeeId)
    incomeData.push(income ? parseFloat(income._sum.amount).toFixed(2) : parseFloat(0).toFixed(2))

    const expense = payeesExpenseReport.find((expense) => expense.payeeId === payeeId)
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
    labels: Object.values(payeesMap),
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
  for (const payeeId of Object.keys(payeesMap)) {
    const income = payeesIncomeReport.find((income) => income.payeeId === payeeId)
    const expense = payeesExpenseReport.find((expense) => expense.payeeId === payeeId)
    table.rows.push([
      payeesMap[payeeId],
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
      payeesIncomeReport.reduce((acc, curr) => acc + parseFloat(curr._sum.amount), 0)
    ).toFixed(2),
    parseFloat(
      payeesExpenseReport.reduce((acc, curr) => acc + parseFloat(curr._sum.amount), 0)
    ).toFixed(2),
    parseFloat(
      payeesIncomeReport.reduce((acc, curr) => acc + parseFloat(curr._sum.amount), 0) +
        payeesExpenseReport.reduce((acc, curr) => acc + parseFloat(curr._sum.amount), 0)
    ).toFixed(2)
  ])

  return {
    chart,
    table
  }
}
