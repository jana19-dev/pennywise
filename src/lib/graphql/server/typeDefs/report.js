export default /* GraphQL */ `
  type Query {
    getAccountBalancesReport(startDate: Date, endDate: Date): JSON!
    getExpenseByCategoryReport(startDate: Date, endDate: Date): JSON!
    getExpenseByPayeeReport(startDate: Date, endDate: Date): JSON!
    getIncomeByPayeeReport(startDate: Date, endDate: Date): JSON!
  }
`
