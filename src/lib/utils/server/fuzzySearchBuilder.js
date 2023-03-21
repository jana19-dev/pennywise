import dateFns from "date-fns"

const getDateRange = (search) => {
  const searchDate = new Date(search)
  const gte = dateFns.startOfDay(searchDate)
  const lt = dateFns.endOfDay(searchDate)
  return { gte, lt }
}

const accountTypes = (search, searchField) => {
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

const accounts = (search, searchField, subSearchField) => {
  const OR = []
  switch (searchField) {
    case `name`:
      OR.push({ name: { contains: search } })
      break
    case `accountType`:
      OR.push({ accountType: { OR: accountTypes(search, subSearchField) } })
      break
    case `startingDate`:
      OR.push({ startingDate: getDateRange(search) })
      break
    case `startingBalance`:
      // search for starting balance greater than or equal to search value floor and ceiling
      OR.push({ startingBalance: { gte: Math.floor(search), lte: Math.ceil(search) } })
      break
    default:
      OR.push({ name: { contains: search } })
  }
  return OR
}

const categories = (search, searchField) => {
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

const payees = (search, searchField) => {
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

const transactions = (search, searchField, subSearchField) => {
  const OR = []
  switch (searchField) {
    case `date`:
      OR.push({ date: getDateRange(search) })
      break
    case `category`:
      OR.push({ category: { OR: categories(search, subSearchField) } })
      break
    case `account`:
      OR.push({ account: { OR: accounts(search, subSearchField) } })
      break
    case `payee`:
      OR.push({ payee: { OR: payees(search, subSearchField) } })
      break
    case `amount`:
      // search for amount greater than or equal to search value floor and ceiling
      OR.push({ amount: { gte: Math.floor(search), lte: Math.ceil(search) } })
      break
    case `memo`:
      OR.push({ memo: { contains: search } })
      break
    default:
      OR.push({ memo: { contains: search } })
  }
  return OR
}

const fuzzySearchBuilder = {
  accountTypes,
  accounts,
  categories,
  payees,
  transactions
}

export default fuzzySearchBuilder
