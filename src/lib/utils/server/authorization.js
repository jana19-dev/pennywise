import { GraphQLError } from "graphql"

export const isAuthenticated = (user) => {
  if (!user) {
    throw new GraphQLError(`Your session has expired or invalid`, { extensions: { code: 401 } })
  }
}
