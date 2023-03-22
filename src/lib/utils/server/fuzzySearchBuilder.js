import dateFns from "date-fns"

const getDateTimeRange = (search) => {
  const searchDate = new Date(search)
  const gte = dateFns.startOfDay(searchDate)
  const lte = dateFns.endOfDay(searchDate)
  return { gte, lte }
}

const accountTypes = (search, searchField) => {
  const OR = []
  switch (searchField) {
    case `name`:
      OR.push({ name: { contains: search, mode: `insensitive` } })
      break
    case `priority`:
      OR.push({ priority: { equals: parseInt(search) } })
      break
    case `accounts`:
      OR.push({ accounts: { some: { OR: accounts(search) } } })
      break
    default:
      OR.push({ name: { contains: search, mode: `insensitive` } })
  }
  return OR
}

const accounts = (search, searchField, subSearchField) => {
  const OR = []
  switch (searchField) {
    case `name`:
      OR.push({ name: { contains: search, mode: `insensitive` } })
      break
    case `accountType`:
      OR.push({ accountType: { OR: accountTypes(search, subSearchField) } })
      break
    case `startingDate`:
      OR.push({ startingDate: getDateTimeRange(search) })
      break
    case `startingBalance`:
      // search for starting balance greater than or equal to search value floor and ceiling
      OR.push({
        startingBalance: { gte: Math.abs(Math.floor(search)), lte: Math.abs(Math.ceil(search)) + 1 }
      })
      OR.push({
        startingBalance: {
          gte: Math.abs(Math.floor(search)) * -1 - 1,
          lte: Math.abs(Math.ceil(search)) * -1
        }
      })
      break
    default:
      OR.push({ name: { contains: search, mode: `insensitive` } })
  }
  return OR
}

const categories = (search, searchField) => {
  const OR = []
  switch (searchField) {
    case `name`:
      OR.push({ name: { contains: search, mode: `insensitive` } })
      break
    default:
      OR.push({ name: { contains: search, mode: `insensitive` } })
  }
  return OR
}

const payees = (search, searchField) => {
  const OR = []
  switch (searchField) {
    case `name`:
      OR.push({ name: { contains: search, mode: `insensitive` } })
      break
    default:
      OR.push({ name: { contains: search, mode: `insensitive` } })
  }
  return OR
}

const transactions = (search, searchField, subSearchField) => {
  const OR = []
  switch (searchField) {
    case `date`:
      OR.push({ date: getDateTimeRange(search) })
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
      OR.push({
        amount: { gte: Math.abs(Math.floor(search)), lte: Math.abs(Math.ceil(search)) + 1 }
      })
      OR.push({
        amount: {
          gte: Math.abs(Math.floor(search)) * -1 - 1,
          lte: Math.abs(Math.ceil(search)) * -1
        }
      })
      break
    case `memo`:
      OR.push({ memo: { contains: search, mode: `insensitive` } })
      break
    default:
      OR.push({ memo: { contains: search, mode: `insensitive` } })
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
