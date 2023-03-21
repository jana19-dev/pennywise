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
  }

  type Mutation {
    createAccountType(name: String!): JSON!

    updateAccountTypeName(id: ID!, name: String!): JSON!

    deleteAccountType(id: ID!): JSON!
  }
`
