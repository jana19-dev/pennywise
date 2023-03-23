import { isAuthenticated } from "$lib/utils/server/authorization"
import fuzzySearchBuilder from "$lib/utils/server/fuzzySearchBuilder"
import { QUERY_LIMIT } from "$lib/utils/constants"

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

  const { search, searchField, subSearchField, skip = 0, orderBy = [{ name: `asc` }] } = args

  const where = { userId: authUser.id }

  // include fuzzy search filters
  if (search) {
    where.AND = search.split(` `).map((word) => ({
      OR: fuzzySearchBuilder.accounts(word, searchField, subSearchField)
    }))
  }

  // setup response
  const response = {
    metrics: {
      skip
    },
    data: []
  }

  // get metrics
  const allCountPromise = context.prisma.account.count({
    where: { userId: authUser.id }
  })
  const filteredCountPromise = context.prisma.account.count({ where })

  const dataPromise = context.prisma.account.findMany({
    where,
    orderBy,
    skip,
    take: QUERY_LIMIT,
    select: {
      id: true,
      name: true,
      accountType: {
        select: {
          id: true,
          name: true
        }
      },
      startingDate: true,
      startingBalance: true
    }
  })

  // wait for all promises to resolve
  const [allCount, filteredCount, data] = await Promise.all([
    allCountPromise,
    filteredCountPromise,
    dataPromise
  ])

  // add metrics to response
  response.metrics.allCount = allCount
  response.metrics.filteredCount = filteredCount

  // add data to response
  response.data = data

  // insert account balance data
  for (const account of response.data) {
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

    account.balance = (parseFloat(balance || 0) + parseFloat(account.startingBalance)).toFixed(2)
  }

  return response
}
