import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const LOGIN = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation LOGIN($accessToken: String!) {
          login(accessToken: $accessToken)
        }
      `,
      variables
    )
    .then(({ login }) => login)
    .catch(handleError)
