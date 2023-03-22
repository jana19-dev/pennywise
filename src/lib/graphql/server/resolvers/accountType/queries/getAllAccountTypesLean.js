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

  const { search } = args

  const where = { userId: authUser.id }

  // include fuzzy search filters
  if (search) {
    where.AND = search.split(` `).map((word) => ({
      OR: [{ name: { contains: word } }]
    }))
  }

  const accountTypes = await context.prisma.accountType.findMany({
    where,
    orderBy: [{ priority: `asc` }, { name: `asc` }],
    select: {
      id: true,
      name: true,
      accounts: {
        select: {
          id: true,
          name: true
        },
        orderBy: { name: `asc` }
      }
    }
  })

  // insert account balances for each account
  for (const accountType of accountTypes) {
    for (const account of accountType.accounts) {
      const {
        _sum: { amount: balance }
      } = await context.prisma.transaction.aggregate({
        where: {
          accountId: account.id
        },
        _sum: {
          amount: true
        }
      })
      account.balance = parseFloat(balance || 0).toFixed(2)
    }
  }

  return accountTypes
}
