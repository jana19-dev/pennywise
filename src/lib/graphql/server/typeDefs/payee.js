export default /* GraphQL */ `
  input PayeeOrderByInput {
    name: SortOrder
  }

  type Query {
    getAllPayees(
      skip: Int
      orderBy: [PayeeOrderByInput!]
      search: String
      searchField: String
      subSearchField: String
    ): JSON!

    getAllPayeesLean(search: String): JSON!
  }

  type Mutation {
    createPayee(name: String!): JSON!

    updatePayeeName(id: ID!, name: String!): JSON!

    deletePayee(id: ID!): JSON!
  }
`
