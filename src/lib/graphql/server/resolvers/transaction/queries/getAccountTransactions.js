import { isAuthenticated } from "$lib/utils/server/authorization"
import fuzzySearchBuilder from "$lib/utils/server/fuzzySearchBuilder"
import { QUERY_LIMIT } from "$lib/utils/constants"
import { GraphQLError } from "graphql"

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

  const {
    accountId,
    search,
    searchField,
    subSearchField,
    skip = 0,
    orderBy = [{ date: `desc`, id: `desc` }]
  } = args

  const where = { userId: authUser.id, accountId }

  const accountExists = await context.prisma.account.findUnique({
    where: { id: accountId },
    select: { id: true, userId: true }
  })

  if (!accountExists) {
    throw new GraphQLError(`Account does not exist.`, {
      extensions: { code: 404 }
    })
  }

  if (accountExists.userId !== authUser.id) {
    throw new GraphQLError(`You do not have permission to delete this account.`, {
      extensions: { code: 403 }
    })
  }

  // include fuzzy search filters
  if (search) {
    where.OR = [
      ...fuzzySearchBuilder.transactions(search, searchField, subSearchField),
      {
        AND: search.split(` `).map((word) => ({
          OR: fuzzySearchBuilder.transactions(word, searchField, subSearchField)
        }))
      }
    ]
  }

  // setup response
  const response = {
    metrics: {
      skip
    },
    data: []
  }

  // get metrics
  const allCountPromise = context.prisma.transaction.count({
    where: { userId: authUser.id, accountId }
  })
  const filteredCountPromise = context.prisma.transaction.count({ where })

  orderBy.push({ id: `desc` })
  const dataPromise = context.prisma.transaction.findMany({
    where,
    orderBy,
    skip,
    take: QUERY_LIMIT,
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

  return response
}
