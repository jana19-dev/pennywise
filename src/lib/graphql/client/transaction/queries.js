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

export const GET_RECENT_TRANSACTION = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_RECENT_TRANSACTION($payeeId: ID, $isTransfer: Boolean) {
          getRecentTransaction(payeeId: $payeeId, isTransfer: $isTransfer)
        }
      `,
      variables
    )
    .then(({ getRecentTransaction }) => getRecentTransaction)
    .catch(handleError)

export const GET_MONTHLY_TRANSACTIONS = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_MONTHLY_TRANSACTIONS($month: String!, $account: String, $category: String, $payee: String) {
          getMonthlyTransactions(month: $month, account: $account, category: $category, payee: $payee)
        }
      `,
      variables
    )
    .then(({ getMonthlyTransactions }) => getMonthlyTransactions)
    .catch(handleError)
