import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const GET_ALL_ACCOUNTS = ({ queryKey: [, variables] = [], pageParam = 0 } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ALL_ACCOUNTS(
          $skip: Int
          $orderBy: [AccountOrderByInput!]
          $search: String
          $searchField: String
          $subSearchField: String
        ) {
          getAllAccounts(
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
    .then(({ getAllAccounts }) => getAllAccounts)
    .catch(handleError)

export const GET_ALL_ACCOUNTS_LEAN = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ALL_ACCOUNTS_LEAN($search: String) {
          getAllAccountsLean(search: $search)
        }
      `,
      variables
    )
    .then(({ getAllAccountsLean }) => getAllAccountsLean)
    .catch(handleError)
