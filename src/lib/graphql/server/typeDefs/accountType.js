export default /* GraphQL */ `
  input AccountTypeOrderByInput {
    name: SortOrder
    priority: SortOrder
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
    createAccountType(name: String!, priority: Int): JSON!

    updateAccountTypeName(id: ID!, name: String!): JSON!
    updateAccountTypePriority(id: ID!, priority: Int!): JSON!

    deleteAccountType(id: ID!): JSON!
  }
`
