export default /* GraphQL */ `
  input AccountOrderByInput {
    name: SortOrder
    type: SortOrder
  }

  type Query {
    getAllAccounts(skip: Int, orderBy: [AccountOrderByInput!], search: String, searchField: String, subSearchField: String): JSON!

    getAllAccountsLean(search: String): JSON!
  }

  type Mutation {
    createAccount(name: String!, accountTypeId: ID!, openingDate: Date!, openingBalance: Float!, description: String): JSON!

    updateAccountName(id: ID!, name: String!): JSON!
    updateAccountType(id: ID!, accountTypeId: ID!): JSON!
    updateAccountDescription(id: ID!, description: String): JSON!

    deleteAccount(id: ID!): JSON!
  }
`
