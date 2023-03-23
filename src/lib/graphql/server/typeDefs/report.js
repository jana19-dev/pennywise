export default /* GraphQL */ `
  type Query {
    getAccountTransactionsReport(startDate: Date, endDate: Date): JSON!
    getCategoryTransactionsReport(startDate: Date, endDate: Date): JSON!
    getPayeeTransactionsReport(startDate: Date, endDate: Date): JSON!
  }
`
