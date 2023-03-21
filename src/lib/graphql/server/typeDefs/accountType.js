export default /* GraphQL */ `
  input AccountTypeOrderByInput {
    name: SortOrder
  }

  type Query {
    getAllAccountTypes(
      skip: Int
      orderBy: [AccountTypeOrderByInput!]
      search: String
      searchField: String
      subSearchField: String
    ): JSON!

    getAllAccountTypesLean(search: String): JSON!
  }

  type Mutation {
    createAccountType(name: String!, order: Int): JSON!

    updateAccountTypeName(id: ID!, name: String!): JSON!
    updateAccountTypeOrder(id: ID!, order: Int!): JSON!

    deleteAccountType(id: ID!): JSON!
  }
`
