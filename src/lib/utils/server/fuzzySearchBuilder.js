// import dateFns from "date-fns"

// const getDateRange = (search) => {
//   const searchDate = new Date(search)
//   const gte = dateFns.startOfDay(searchDate)
//   const lt = dateFns.endOfDay(searchDate)
//   return { gte, lt }
// }

const budgets = (search, searchField) => {
  const OR = []
  switch (searchField) {
    case `name`:
      OR.push({ name: { contains: search } })
      break
    default:
      OR.push({ name: { contains: search } })
  }
  return OR
}

const fuzzySearchBuilder = {
  budgets
}

export default fuzzySearchBuilder
