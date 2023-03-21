export default /* GraphQL */ `
  input CategoryOrderByInput {
    name: SortOrder
  }

  type Query {
    getAllCategories(
      skip: Int
      orderBy: [CategoryOrderByInput!]
      search: String
      searchField: String
      subSearchField: String
    ): JSON!

    getAllCategoriesLean(search: String): JSON!
  }

  type Mutation {
    createCategory(name: String!): JSON!

    updateCategoryName(id: ID!, name: String!): JSON!

    deleteCategory(id: ID!): JSON!
  }
`
