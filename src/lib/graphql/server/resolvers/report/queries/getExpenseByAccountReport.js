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

  const accountsMap = (
    await context.prisma.account.findMany({
      select: { id: true, name: true },
      orderBy: {
        accountType: {
          priority: `asc`
        }
      }
    })
  ).reduce((acc, curr) => {
    acc[curr.id] = curr.name
    return acc
  }, {})

  const accountsExpenseReport = await context.prisma.transaction.groupBy({
    by: [`accountId`],
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

  const expenseData = []
  for (const accountId of Object.keys(accountsMap)) {
    const expense = accountsExpenseReport.find((expense) => expense.accountId === accountId)
    expenseData.push(
      expense ? parseFloat(expense._sum.amount * -1).toFixed(2) : parseFloat(0).toFixed(2)
    )
  }

  // construct the chart response
  const chart = {
    labels: Object.values(accountsMap),
    datasets: [
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
  for (const accountId of Object.keys(accountsMap)) {
    const expense = accountsExpenseReport.find((expense) => expense.accountId === accountId)
    table.rows.push([
      accountsMap[accountId],
      expense ? parseFloat(expense._sum.amount).toFixed(2) : parseFloat(0).toFixed(2)
    ])
  }
  // add the total row
  table.rows.push([
    `TOTAL`,
    parseFloat(
      accountsExpenseReport.reduce((acc, curr) => acc + parseFloat(curr._sum.amount), 0)
    ).toFixed(2)
  ])

  return {
    chart,
    table
  }
}
