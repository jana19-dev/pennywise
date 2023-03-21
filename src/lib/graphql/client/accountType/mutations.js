import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const CREATE_ACCOUNT_TYPE = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation CREATE_ACCOUNT_TYPE($name: String!) {
          createAccountType(name: $name)
        }
      `,
      variables
    )
    .then(({ createAccountType }) => createAccountType)
    .catch(handleError)

export const UPDATE_ACCOUNT_TYPE_NAME = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_ACCOUNT_TYPE_NAME($id: ID!, $name: String!) {
          updateAccountTypeName(id: $id, name: $name)
        }
      `,
      variables
    )
    .then(({ updateAccountTypeName }) => updateAccountTypeName)
    .catch(handleError)

export const DELETE_ACCOUNT_TYPE = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation DELETE_ACCOUNT_TYPE($id: ID!) {
          deleteAccountType(id: $id)
        }
      `,
      variables
    )
    .then(({ deleteAccountType }) => deleteAccountType)
    .catch(handleError)
