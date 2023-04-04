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

  const { month, account, category, payee } = args

  const where = { userId: authUser.id }

  // setup response
  const response = {
    metrics: {},
    data: []
  }

  // setup where clause
  const startDate = new Date(month)
  const endDate = new Date(month)
  endDate.setMonth(endDate.getMonth() + 1)
  endDate.setDate(endDate.getDate() - 1)

  where.date = {
    gte: startDate,
    lte: endDate
  }

  if (account) {
    where.account = {
      name: {
        equals: account
      }
    }
  }

  if (category) {
    where.category = {
      name: {
        equals: category
      }
    }
  }

  if (payee) {
    where.payee = {
      name: {
        equals: payee
      }
    }
  }

  // get metrics
  const allCountPromise = context.prisma.transaction.count({
    where
  })

  const dataPromise = context.prisma.transaction.findMany({
    where,
    orderBy: [
      {
        date: `desc`
      },
      {
        createdAt: `desc`
      },
      {
        payee: {
          name: `desc`
        }
      }
    ],
    select: {
      id: true,
      date: true,
      account: {
        select: {
          id: true,
          name: true
        }
      },
      category: {
        select: {
          id: true,
          name: true
        }
      },
      payee: {
        select: {
          id: true,
          name: true
        }
      },
      transferTo: {
        select: {
          account: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      amount: true,
      memo: true
    }
  })

  // wait for all promises to resolve
  const [allCount, data] = await Promise.all([allCountPromise, dataPromise])

  // add metrics to response
  response.metrics.allCount = allCount
  response.metrics.sum = data.reduce((sum, transaction) => sum + transaction.amount, 0)

  // add data to response
  response.data = data

  return response
}
