import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const GET_ALL_PAYEES = ({ queryKey: [, variables] = [], pageParam = 0 } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ALL_PAYEES($skip: Int, $orderBy: [PayeeOrderByInput!], $search: String, $searchField: String, $subSearchField: String) {
          getAllPayees(skip: $skip, orderBy: $orderBy, search: $search, searchField: $searchField, subSearchField: $subSearchField)
        }
      `,
      { ...variables, skip: pageParam }
    )
    .then(({ getAllPayees }) => getAllPayees)
    .catch(handleError)

export const GET_ALL_PAYEES_LEAN = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ALL_PAYEES_LEAN($search: String) {
          getAllPayeesLean(search: $search)
        }
      `,
      variables
    )
    .then(({ getAllPayeesLean }) => getAllPayeesLean)
    .catch(handleError)
