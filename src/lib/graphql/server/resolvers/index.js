import { DateResolver, JSONResolver } from "graphql-scalars"

import authMutations from "$lib/graphql/server/resolvers/auth/mutations"

import accountQueries from "$lib/graphql/server/resolvers/account/queries"
import accountMutations from "$lib/graphql/server/resolvers/account/mutations"

import accountTypeQueries from "$lib/graphql/server/resolvers/accountType/queries"
import accountTypeMutations from "$lib/graphql/server/resolvers/accountType/mutations"

import categoryQueries from "$lib/graphql/server/resolvers/category/queries"
import categoryMutations from "$lib/graphql/server/resolvers/category/mutations"

import payeeQueries from "$lib/graphql/server/resolvers/payee/queries"
import payeeMutations from "$lib/graphql/server/resolvers/payee/mutations"

import transactionQueries from "$lib/graphql/server/resolvers/transaction/queries"
import transactionMutations from "$lib/graphql/server/resolvers/transaction/mutations"

const resolvers = {
  Date: DateResolver,
  JSON: JSONResolver,

  Query: {
    ...accountQueries,
    ...accountTypeQueries,
    ...categoryQueries,
    ...payeeQueries,
    ...transactionQueries
  },
  Mutation: {
    ...authMutations,
    ...accountMutations,
    ...accountTypeMutations,
    ...categoryMutations,
    ...payeeMutations,
    ...transactionMutations
  }
}

export default resolvers
