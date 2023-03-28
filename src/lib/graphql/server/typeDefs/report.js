export default /* GraphQL */ `
  type Query {
    getAccountsReport(startDate: Date, endDate: Date): JSON!
    getCategoriesReport(startDate: Date, endDate: Date): JSON!
    getPayeesReport(startDate: Date, endDate: Date): JSON!
    getForecastReport: JSON!
  }
`
