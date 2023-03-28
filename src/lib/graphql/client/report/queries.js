import { graphQLClient, gql, handleError } from "$lib/graphql/client"

export const GET_ACCOUNTS_REPORT = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_ACCOUNTS_REPORT($startDate: Date, $endDate: Date) {
          getAccountsReport(startDate: $startDate, endDate: $endDate)
        }
      `,
      variables
    )
    .then(({ getAccountsReport }) => getAccountsReport)
    .catch(handleError)

export const GET_CATEGORIES_REPORT = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_CATEGORIES_REPORT($startDate: Date, $endDate: Date) {
          getCategoriesReport(startDate: $startDate, endDate: $endDate)
        }
      `,
      variables
    )
    .then(({ getCategoriesReport }) => getCategoriesReport)
    .catch(handleError)

export const GET_PAYEES_REPORT = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_PAYEES_REPORT($startDate: Date, $endDate: Date) {
          getPayeesReport(startDate: $startDate, endDate: $endDate)
        }
      `,
      variables
    )
    .then(({ getPayeesReport }) => getPayeesReport)
    .catch(handleError)

export const GET_FORECAST_REPORT = ({ queryKey: [, variables] = [] } = {}) =>
  graphQLClient
    .request(
      gql`
        query GET_FORECAST_REPORT {
          getForecastReport
        }
      `,
      variables
    )
    .then(({ getForecastReport }) => getForecastReport)
    .catch(handleError)
