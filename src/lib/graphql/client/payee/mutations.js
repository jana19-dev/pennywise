import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const CREATE_PAYEE = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation CREATE_PAYEE($name: String!) {
          createPayee(name: $name)
        }
      `,
      variables
    )
    .then(({ createPayee }) => createPayee)
    .catch(handleError)

export const UPDATE_PAYEE_NAME = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_PAYEE_NAME($id: ID!, $name: String!) {
          updatePayeeName(id: $id, name: $name)
        }
      `,
      variables
    )
    .then(({ updatePayeeName }) => updatePayeeName)
    .catch(handleError)

export const DELETE_PAYEE = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation DELETE_PAYEE($id: ID!) {
          deletePayee(id: $id)
        }
      `,
      variables
    )
    .then(({ deletePayee }) => deletePayee)
    .catch(handleError)
