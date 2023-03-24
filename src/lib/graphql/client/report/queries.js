import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const GET_ACCOUNT_TRANSACTIONS_REPORT = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ACCOUNT_TRANSACTIONS_REPORT($startDate: Date, $endDate: Date) {
          getAccountTransactionsReport(startDate: $startDate, endDate: $endDate)
        }
      `,
      variables
    )
    .then(({ getAccountTransactionsReport }) => getAccountTransactionsReport)
    .catch(handleError)

export const GET_CATEGORY_TRANSACTIONS_REPORT = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_CATEGORY_TRANSACTIONS_REPORT($startDate: Date, $endDate: Date) {
          getCategoryTransactionsReport(startDate: $startDate, endDate: $endDate)
        }
      `,
      variables
    )
    .then(({ getCategoryTransactionsReport }) => getCategoryTransactionsReport)
    .catch(handleError)

export const GET_PAYEE_TRANSACTIONS_REPORT = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_PAYEE_TRANSACTIONS_REPORT($startDate: Date, $endDate: Date) {
          getPayeeTransactionsReport(startDate: $startDate, endDate: $endDate)
        }
      `,
      variables
    )
    .then(({ getPayeeTransactionsReport }) => getPayeeTransactionsReport)
    .catch(handleError)

export const GET_EXPENSE_BY_CATEGORY_REPORT = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_EXPENSE_BY_CATEGORY_REPORT($startDate: Date, $endDate: Date) {
          getExpenseByCategoryReport(startDate: $startDate, endDate: $endDate)
        }
      `,
      variables
    )
    .then(({ getExpenseByCategoryReport }) => getExpenseByCategoryReport)
    .catch(handleError)

export const GET_EXPENSE_BY_PAYEE_REPORT = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_EXPENSE_BY_PAYEE_REPORT($startDate: Date, $endDate: Date) {
          getExpenseByPayeeReport(startDate: $startDate, endDate: $endDate)
        }
      `,
      variables
    )
    .then(({ getExpenseByPayeeReport }) => getExpenseByPayeeReport)
    .catch(handleError)

export const GET_INCOME_BY_PAYEE_REPORT = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_INCOME_BY_PAYEE_REPORT($startDate: Date, $endDate: Date) {
          getIncomeByPayeeReport(startDate: $startDate, endDate: $endDate)
        }
      `,
      variables
    )
    .then(({ getIncomeByPayeeReport }) => getIncomeByPayeeReport)
    .catch(handleError)

export const GET_ACCOUNT_BALANCES_REPORT = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ACCOUNT_BALANCES_REPORT($startDate: Date, $endDate: Date) {
          getAccountBalancesReport(startDate: $startDate, endDate: $endDate)
        }
      `,
      variables
    )
    .then(({ getAccountBalancesReport }) => getAccountBalancesReport)
    .catch(handleError)
