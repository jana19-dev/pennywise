import { isAuthenticated } from "$lib/utils/server/authorization"
import fuzzySearchBuilder from "$lib/utils/server/fuzzySearchBuilder"
import { QUERY_LIMIT } from "$lib/utils/constants"

export default async function handler(parent, args, context) {
  // permissions
  isAuthenticated(context.user)

  const {
    search,
    searchField,
    subSearchField,
    skip = 0,
    where = {},
    orderBy = [{ name: `asc` }]
  } = args

  // include fuzzy search filters
  if (search) {
    where.AND = search.split(` `).map((word) => ({
      OR: fuzzySearchBuilder.budgets(word, searchField, subSearchField)
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
  const allCountPromise = context.prisma.budget.count()
  const filteredCountPromise = context.prisma.budget.count({ where })

  // get companies
  const dataPromise = context.prisma.budget.findMany({
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
