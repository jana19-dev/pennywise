import { DateResolver, JSONResolver } from "graphql-scalars"

import authMutations from "$lib/graphql/server/resolvers/auth/mutations"

import budgetQueries from "$lib/graphql/server/resolvers/budget/queries"

const resolvers = {
  Date: DateResolver,
  JSON: JSONResolver,

  Query: {
    ...budgetQueries
  },
  Mutation: {
    ...authMutations
  }
}

export default resolvers
