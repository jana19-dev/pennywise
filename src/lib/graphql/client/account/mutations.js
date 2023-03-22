import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const CREATE_ACCOUNT = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation CREATE_ACCOUNT(
          $name: String!
          $accountTypeId: ID!
          $startingDate: Date!
          $startingBalance: Float!
        ) {
          createAccount(
            name: $name
            accountTypeId: $accountTypeId
            startingDate: $startingDate
            startingBalance: $startingBalance
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

export const UPDATE_ACCOUNT_STARTING_DATE = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_ACCOUNT_STARTING_DATE($id: ID!, $startingDate: Date!) {
          updateAccountStartingDate(id: $id, startingDate: $startingDate)
        }
      `,
      variables
    )
    .then(({ updateAccountStartingDate }) => updateAccountStartingDate)
    .catch(handleError)

export const UPDATE_ACCOUNT_STARTING_BALANCE = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_ACCOUNT_STARTING_BALANCE($id: ID!, $startingBalance: Float!) {
          updateAccountStartingBalance(id: $id, startingBalance: $startingBalance)
        }
      `,
      variables
    )
    .then(({ updateAccountStartingBalance }) => updateAccountStartingBalance)
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
