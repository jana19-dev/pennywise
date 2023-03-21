export default /* GraphQL */ `
  input AccountOrderByInput {
    name: SortOrder
    type: SortOrder
    startingDate: SortOrder
    startingBalance: SortOrder
  }

  type Query {
    getAllAccounts(
      skip: Int
      orderBy: [AccountOrderByInput!]
      search: String
      searchField: String
      subSearchField: String
    ): JSON!
  }

  type Mutation {
    createAccount(
      name: String!
      accountTypeId: ID!
      startingDate: Date!
      startingBalance: Float!
    ): JSON!

    updateAccountName(id: ID!, name: String!): JSON!
    updateAccountType(id: ID!, accountTypeId: ID!): JSON!
    updateAccountStartingDate(id: ID!, startingDate: Date!): JSON!
    updateAccountStartingBalance(id: ID!, startingBalance: Float!): JSON!

    deleteAccount(id: ID!): JSON!
  }
`
