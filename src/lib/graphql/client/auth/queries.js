import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const GET_USER_OVERVIEW = () =>
  graphQLClient
    .request(gql`
      query GET_USER_OVERVIEW {
        getUserOverview
      }
    `)
    .then(({ getUserOverview }) => getUserOverview)
    .catch(handleError)
