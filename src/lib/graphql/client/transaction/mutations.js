import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const CREATE_TRANSACTION = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation CREATE_TRANSACTION(
          $date: Date!
          $accountId: ID!
          $categoryId: ID
          $payeeId: ID
          $amount: Float!
          $memo: String
        ) {
          createTransaction(
            date: $date
            accountId: $accountId
            categoryId: $categoryId
            payeeId: $payeeId
            amount: $amount
            memo: $memo
          )
        }
      `,
      variables
    )
    .then(({ createTransaction }) => createTransaction)
    .catch(handleError)

export const UPDATE_TRANSACTION_DATE = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_TRANSACTION_DATE($id: ID!, $date: Date!) {
          updateTransactionDate(id: $id, date: $date)
        }
      `,
      variables
    )
    .then(({ updateTransactionDate }) => updateTransactionDate)
    .catch(handleError)

export const UPDATE_TRANSACTION_ACCOUNT = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_TRANSACTION_ACCOUNT($id: ID!, $accountId: ID!) {
          updateTransactionAccount(id: $id, accountId: $accountId)
        }
      `,
      variables
    )
    .then(({ updateTransactionAccount }) => updateTransactionAccount)
    .catch(handleError)

export const UPDATE_TRANSACTION_CATEGORY = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_TRANSACTION_CATEGORY($id: ID!, $categoryId: ID!) {
          updateTransactionCategory(id: $id, categoryId: $categoryId)
        }
      `,
      variables
    )
    .then(({ updateTransactionCategory }) => updateTransactionCategory)
    .catch(handleError)

export const UPDATE_TRANSACTION_PAYEE = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_TRANSACTION_PAYEE($id: ID!, $payeeId: ID!) {
          updateTransactionPayee(id: $id, payeeId: $payeeId)
        }
      `,
      variables
    )
    .then(({ updateTransactionPayee }) => updateTransactionPayee)
    .catch(handleError)

export const UPDATE_TRANSACTION_AMOUNT = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_TRANSACTION_AMOUNT($id: ID!, $amount: Float!) {
          updateTransactionAmount(id: $id, amount: $amount)
        }
      `,
      variables
    )
    .then(({ updateTransactionAmount }) => updateTransactionAmount)
    .catch(handleError)

export const UPDATE_TRANSACTION_MEMO = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation UPDATE_TRANSACTION_MEMO($id: ID!, $memo: String) {
          updateTransactionMemo(id: $id, memo: $memo)
        }
      `,
      variables
    )
    .then(({ updateTransactionMemo }) => updateTransactionMemo)
    .catch(handleError)

export const DELETE_TRANSACTION = async (variables) =>
  graphQLClient
    .request(
      gql`
        mutation DELETE_TRANSACTION($id: ID!) {
          deleteTransaction(id: $id)
        }
      `,
      variables
    )
    .then(({ deleteTransaction }) => deleteTransaction)
    .catch(handleError)
