export default /* GraphQL */ `
  type Query {
    getUserOverview: JSON!
  }

  type Mutation {
    login(accessToken: String!): JSON!
  }
`
