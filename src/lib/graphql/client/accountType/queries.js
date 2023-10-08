import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const GET_ALL_ACCOUNT_TYPES = ({ queryKey: [, variables] = [], pageParam = 0 } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ALL_ACCOUNT_TYPES(
          $skip: Int
          $orderBy: [AccountTypeOrderByInput!]
          $search: String
          $searchField: String
          $subSearchField: String
        ) {
          getAllAccountTypes(skip: $skip, orderBy: $orderBy, search: $search, searchField: $searchField, subSearchField: $subSearchField)
        }
      `,
      { ...variables, skip: pageParam }
    )
    .then(({ getAllAccountTypes }) => getAllAccountTypes)
    .catch(handleError)

export const GET_ALL_ACCOUNT_TYPES_LEAN = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ALL_ACCOUNT_TYPES_LEAN($search: String) {
          getAllAccountTypesLean(search: $search)
        }
      `,
      variables
    )
    .then(({ getAllAccountTypesLean }) => getAllAccountTypesLean)
    .catch(handleError)
