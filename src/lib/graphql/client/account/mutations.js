import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const CREATE_ACCOUNT = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation CREATE_ACCOUNT(
          $name: String!
          $accountTypeId: ID!
          $openingDate: Date!
          $openingBalance: Float!
        ) {
          createAccount(
            name: $name
            accountTypeId: $accountTypeId
            openingDate: $openingDate
            openingBalance: $openingBalance
          )
        }
      `,
      variables
    )
    .then(({ createAccount }) => createAccount)
    .catch(handleError)

export const UPDATE_ACCOUNT_NAME = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_ACCOUNT_NAME($id: ID!, $name: String!) {
          updateAccountName(id: $id, name: $name)
        }
      `,
      variables
    )
    .then(({ updateAccountName }) => updateAccountName)
    .catch(handleError)

export const UPDATE_ACCOUNT_TYPE = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_ACCOUNT_TYPE($id: ID!, $accountTypeId: ID!) {
          updateAccountType(id: $id, accountTypeId: $accountTypeId)
        }
      `,
      variables
    )
    .then(({ updateAccountType }) => updateAccountType)
    .catch(handleError)

export const DELETE_ACCOUNT = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation DELETE_ACCOUNT($id: ID!) {
          deleteAccount(id: $id)
        }
      `,
      variables
    )
    .then(({ deleteAccount }) => deleteAccount)
    .catch(handleError)
