import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const GET_ALL_TRANSACTIONS = ({ queryKey: [, variables] = [], pageParam = 0 } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ALL_TRANSACTIONS(
          $skip: Int
          $orderBy: [TransactionOrderByInput!]
          $search: String
          $searchField: String
          $subSearchField: String
        ) {
          getAllTransactions(
            skip: $skip
            orderBy: $orderBy
            search: $search
            searchField: $searchField
            subSearchField: $subSearchField
          )
        }
      `,
      { ...variables, skip: pageParam }
    )
    .then(({ getAllTransactions }) => getAllTransactions)
    .catch(handleError)

export const GET_ACCOUNT_TRANSACTIONS = ({ queryKey: [, variables] = [], pageParam = 0 } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ACCOUNT_TRANSACTIONS(
          $accountId: ID!
          $skip: Int
          $orderBy: [TransactionOrderByInput!]
          $search: String
          $searchField: String
          $subSearchField: String
        ) {
          getAccountTransactions(
            accountId: $accountId
            skip: $skip
            orderBy: $orderBy
            search: $search
            searchField: $searchField
            subSearchField: $subSearchField
          )
        }
      `,
      { ...variables, skip: pageParam }
    )
    .then(({ getAccountTransactions }) => getAccountTransactions)
    .catch(handleError)
