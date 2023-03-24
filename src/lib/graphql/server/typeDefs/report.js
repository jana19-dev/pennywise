export default /* GraphQL */ `
  type Query {
    getAccountTransactionsReport(startDate: Date, endDate: Date): JSON!
    getCategoryTransactionsReport(startDate: Date, endDate: Date): JSON!
    getPayeeTransactionsReport(startDate: Date, endDate: Date): JSON!
    getExpenseByCategoryReport(startDate: Date, endDate: Date): JSON!
    getExpenseByPayeeReport(startDate: Date, endDate: Date): JSON!
    getIncomeByPayeeReport(startDate: Date, endDate: Date): JSON!
    getAccountBalancesReport(startDate: Date, endDate: Date): JSON!
  }
`
