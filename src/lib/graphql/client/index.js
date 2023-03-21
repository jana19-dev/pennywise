import { GraphQLClient, gql } from "graphql-request"

const graphQLClient = new GraphQLClient(`/api/graphql`, {
  credentials: `include`,
  headers: {
    "Content-Type": `application/json`,
    Accept: `application/json`
  }
})

const handleError = (error) => {
  // prettify the graphql error message
  if (error.message.includes(`errors`) > 0) {
    const firstError = error.response.errors[0]
    error.message = firstError.message
    // if the error is a 401, redirect to login
    if (firstError?.extensions?.code === 401 && !window.location.pathname.includes(`/login`)) {
      const referer = encodeURIComponent(window.location.href)
      window.location.href = `/login?referrer=${referer}`
    }
  }
  throw new Error(error.message)
}

export { graphQLClient, gql, handleError }
