import { isAuthenticated } from "$lib/utils/server/authorization"

export default async function handler(parent, args, context) {
  // permissions
  isAuthenticated(context.user)

  const authUser = await context.prisma.user.findUnique({
    where: {
      email: context.user.email
    },
    select: {
      id: true
    }
  })

  const where = { userId: authUser.id }

  // get counts of all user accounts, categories, payees, and transactions
  const [accounts, categories, payees, transactions] = await Promise.all([
    context.prisma.account.count({ where }),
    context.prisma.category.count({ where }),
    context.prisma.payee.count({ where }),
    context.prisma.transaction.count({ where })
  ])

  const netWorth = await context.prisma.transaction.aggregate({
    where,
    _sum: {
      amount: true
    }
  })

  const accountStartingBalances = await context.prisma.account.aggregate({
    where,
    _sum: {
      startingBalance: true
    }
  })

  return {
    accounts,
    categories,
    payees,
    transactions,
    netWorth: (
      parseFloat(netWorth._sum.amount || 0) +
      parseFloat(accountStartingBalances._sum.startingBalance || 0)
    ).toFixed(2)
  }
}
