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
    where.OR = [
      ...fuzzySearchBuilder.payees(search, searchField, subSearchField),
      {
        AND: search.split(` `).map((word) => ({
          OR: fuzzySearchBuilder.payees(word, searchField, subSearchField)
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
  const allCountPromise = context.prisma.payee.count({
    where: { userId: authUser.id }
  })
  const filteredCountPromise = context.prisma.payee.count({ where })

  orderBy.push({ id: `desc` })
  const dataPromise = context.prisma.payee.findMany({
    where,
    orderBy,
    skip,
    take: QUERY_LIMIT,
    select: {
      id: true,
      name: true
    }
  })

  // wait for all promises to resolve
  const [allCount, filteredCount, data] = await Promise.all([allCountPromise, filteredCountPromise, dataPromise])

  // add metrics to response
  response.metrics.allCount = allCount
  response.metrics.filteredCount = filteredCount

  // add data to response
  response.data = data

  return response
}
