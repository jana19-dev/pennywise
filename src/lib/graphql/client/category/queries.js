import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const GET_ALL_CATEGORIES = ({ queryKey: [, variables] = [], pageParam = 0 } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ALL_CATEGORIES(
          $skip: Int
          $orderBy: [CategoryOrderByInput!]
          $search: String
          $searchField: String
          $subSearchField: String
        ) {
          getAllCategories(skip: $skip, orderBy: $orderBy, search: $search, searchField: $searchField, subSearchField: $subSearchField)
        }
      `,
      { ...variables, skip: pageParam }
    )
    .then(({ getAllCategories }) => getAllCategories)
    .catch(handleError)

export const GET_ALL_CATEGORIES_LEAN = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ALL_CATEGORIES_LEAN($search: String) {
          getAllCategoriesLean(search: $search)
        }
      `,
      variables
    )
    .then(({ getAllCategoriesLean }) => getAllCategoriesLean)
    .catch(handleError)
