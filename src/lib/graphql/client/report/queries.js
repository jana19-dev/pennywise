import { graphQLClient, gql, handleError } from "$lib/graphql/client"

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
