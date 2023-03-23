export default /* GraphQL */ `
  input TransactionOrderByInput {
    date: SortOrder
    amount: SortOrder
  }

  type Query {
    getAllTransactions(
      skip: Int
      orderBy: [TransactionOrderByInput!]
      search: String
      searchField: String
      subSearchField: String
    ): JSON!

    getAccountTransactions(
      accountId: ID!
      skip: Int
      orderBy: [TransactionOrderByInput!]
      search: String
      searchField: String
      subSearchField: String
    ): JSON!
  }

  type Mutation {
    createTransaction(
      date: Date!
      accountId: ID!
      categoryId: ID
      payeeId: ID
      transferAccountId: ID
      amount: Float!
      memo: String
    ): JSON!

    updateTransactionDate(id: ID!, date: Date!): JSON!
    updateTransactionAccount(id: ID!, accountId: ID!): JSON!
    updateTransactionCategory(id: ID!, categoryId: ID!): JSON!
    updateTransactionPayee(id: ID!, payeeId: ID!): JSON!
    updateTransactionAmount(id: ID!, amount: Float!): JSON!
    updateTransactionMemo(id: ID!, memo: String): JSON!

    deleteTransaction(id: ID!): JSON!
  }
`
