export const INVALIDATE_QUERIES_FROM_MUTATION = {
  CREATE_ACCOUNT_TYPE: [`GET_ALL_ACCOUNT_TYPES`, `GET_ALL_ACCOUNT_TYPES_LEAN`],
  UPDATE_ACCOUNT_TYPE_NAME: [
    `GET_ALL_ACCOUNT_TYPES`,
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`
  ],
  UPDATE_ACCOUNT_TYPE_PRIORITY: [`GET_ALL_ACCOUNT_TYPES`, `GET_ALL_ACCOUNT_TYPES_LEAN`, `GET_ACCOUNTS_REPORT`],
  DELETE_ACCOUNT_TYPE: [`GET_ALL_ACCOUNT_TYPES`, `GET_ALL_ACCOUNT_TYPES_LEAN`],
  CREATE_ACCOUNT: [
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_ACCOUNTS_LEAN`,
    `GET_ALL_ACCOUNT_TYPES`,
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_USER_OVERVIEW`,
    `GET_ACCOUNTS_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  UPDATE_ACCOUNT_NAME: [
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_ACCOUNTS_LEAN`,
    `GET_ALL_ACCOUNT_TYPES`,
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_ACCOUNTS_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  UPDATE_ACCOUNT_TYPE: [
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_ACCOUNTS_LEAN`,
    `GET_ALL_ACCOUNT_TYPES`,
    `GET_ALL_ACCOUNT_TYPES_LEAN`
  ],
  UPDATE_ACCOUNT_DESCRIPTION: [`GET_ALL_ACCOUNTS`],
  DELETE_ACCOUNT: [
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_ACCOUNTS_LEAN`,
    `GET_ALL_ACCOUNT_TYPES`,
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_USER_OVERVIEW`,
    `GET_ACCOUNTS_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  CREATE_CATEGORY: [
    `GET_ALL_CATEGORIES`,
    `GET_ALL_CATEGORIES_LEAN`,
    `GET_USER_OVERVIEW`,
    `GET_CATEGORIES_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  UPDATE_CATEGORY_NAME: [
    `GET_ALL_CATEGORIES`,
    `GET_ALL_CATEGORIES_LEAN`,
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_CATEGORIES_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  DELETE_CATEGORY: [
    `GET_ALL_CATEGORIES`,
    `GET_ALL_CATEGORIES_LEAN`,
    `GET_USER_OVERVIEW`,
    `GET_CATEGORIES_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  CREATE_PAYEE: [
    `GET_ALL_PAYEES`,
    `GET_ALL_PAYEES_LEAN`,
    `GET_USER_OVERVIEW`,
    `GET_PAYEES_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  UPDATE_PAYEE_NAME: [
    `GET_ALL_PAYEES`,
    `GET_ALL_PAYEES_LEAN`,
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_PAYEES_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  DELETE_PAYEE: [
    `GET_ALL_PAYEES`,
    `GET_ALL_PAYEES_LEAN`,
    `GET_USER_OVERVIEW`,
    `GET_PAYEES_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  CREATE_TRANSACTION: [
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_USER_OVERVIEW`,
    `GET_ACCOUNTS_REPORT`,
    `GET_CATEGORIES_REPORT`,
    `GET_PAYEES_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  UPDATE_TRANSACTION_DATE: [
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_ACCOUNTS_REPORT`,
    `GET_CATEGORIES_REPORT`,
    `GET_PAYEES_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  UPDATE_TRANSACTION_ACCOUNT: [
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_ACCOUNTS_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  UPDATE_TRANSACTION_CATEGORY: [
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_CATEGORIES_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  UPDATE_TRANSACTION_PAYEE: [
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_PAYEES_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  UPDATE_TRANSACTION_AMOUNT: [
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_USER_OVERVIEW`,
    `GET_ACCOUNTS_REPORT`,
    `GET_CATEGORIES_REPORT`,
    `GET_PAYEES_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ],
  UPDATE_TRANSACTION_MEMO: [`GET_ALL_TRANSACTIONS`, `GET_ACCOUNT_TRANSACTIONS`, `GET_MONTHLY_TRANSACTIONS`],
  DELETE_TRANSACTION: [
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_USER_OVERVIEW`,
    `GET_ACCOUNTS_REPORT`,
    `GET_CATEGORIES_REPORT`,
    `GET_PAYEES_REPORT`,
    `GET_MONTHLY_TRANSACTIONS`
  ]
}
