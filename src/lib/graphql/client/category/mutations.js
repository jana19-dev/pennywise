import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const CREATE_CATEGORY = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation CREATE_CATEGORY($name: String!) {
          createCategory(name: $name)
        }
      `,
      variables
    )
    .then(({ createCategory }) => createCategory)
    .catch(handleError)

export const UPDATE_CATEGORY_NAME = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_CATEGORY_NAME($id: ID!, $name: String!) {
          updateCategoryName(id: $id, name: $name)
        }
      `,
      variables
    )
    .then(({ updateCategoryName }) => updateCategoryName)
    .catch(handleError)

export const DELETE_CATEGORY = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation DELETE_CATEGORY($id: ID!) {
          deleteCategory(id: $id)
        }
      `,
      variables
    )
    .then(({ deleteCategory }) => deleteCategory)
    .catch(handleError)
