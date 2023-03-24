export const INVALIDATE_QUERIES_FROM_MUTATION = {
  CREATE_ACCOUNT_TYPE: [`GET_ALL_ACCOUNT_TYPES`, `GET_ALL_ACCOUNT_TYPES_LEAN`],
  UPDATE_ACCOUNT_TYPE_NAME: [`GET_ALL_ACCOUNT_TYPES`, `GET_ALL_ACCOUNT_TYPES_LEAN`],
  UPDATE_ACCOUNT_TYPE_PRIORITY: [`GET_ALL_ACCOUNT_TYPES`, `GET_ALL_ACCOUNT_TYPES_LEAN`],
  DELETE_ACCOUNT_TYPE: [`GET_ALL_ACCOUNT_TYPES`, `GET_ALL_ACCOUNT_TYPES_LEAN`],
  CREATE_ACCOUNT: [
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_ACCOUNTS_LEAN`,
    `GET_ALL_ACCOUNT_TYPES`,
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_USER_OVERVIEW`
  ],
  UPDATE_ACCOUNT_NAME: [
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_ACCOUNTS_LEAN`,
    `GET_ALL_ACCOUNT_TYPES`,
    `GET_ALL_ACCOUNT_TYPES_LEAN`
  ],
  UPDATE_ACCOUNT_TYPE: [
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_ACCOUNTS_LEAN`,
    `GET_ALL_ACCOUNT_TYPES`,
    `GET_ALL_ACCOUNT_TYPES_LEAN`
  ],
  DELETE_ACCOUNT: [
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_ACCOUNTS_LEAN`,
    `GET_ALL_ACCOUNT_TYPES`,
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_USER_OVERVIEW`
  ],
  CREATE_CATEGORY: [`GET_ALL_CATEGORIES`, `GET_ALL_CATEGORIES_LEAN`, `GET_USER_OVERVIEW`],
  UPDATE_CATEGORY_NAME: [`GET_ALL_CATEGORIES`, `GET_ALL_CATEGORIES_LEAN`],
  DELETE_CATEGORY: [`GET_ALL_CATEGORIES`, `GET_ALL_CATEGORIES_LEAN`, `GET_USER_OVERVIEW`],
  CREATE_PAYEE: [`GET_ALL_PAYEES`, `GET_ALL_PAYEES_LEAN`, `GET_USER_OVERVIEW`],
  UPDATE_PAYEE_NAME: [`GET_ALL_PAYEES`, `GET_ALL_PAYEES_LEAN`],
  DELETE_PAYEE: [`GET_ALL_PAYEES`, `GET_ALL_PAYEES_LEAN`, `GET_USER_OVERVIEW`],
  CREATE_TRANSACTION: [
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_USER_OVERVIEW`
  ],
  UPDATE_TRANSACTION_DATE: [`GET_ALL_TRANSACTIONS`, `GET_ACCOUNT_TRANSACTIONS`],
  UPDATE_TRANSACTION_ACCOUNT: [
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`
  ],
  UPDATE_TRANSACTION_CATEGORY: [`GET_ALL_TRANSACTIONS`],
  UPDATE_TRANSACTION_PAYEE: [`GET_ALL_TRANSACTIONS`],
  UPDATE_TRANSACTION_AMOUNT: [
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_USER_OVERVIEW`
  ],
  UPDATE_TRANSACTION_MEMO: [`GET_ALL_TRANSACTIONS`],
  DELETE_TRANSACTION: [
    `GET_ALL_ACCOUNT_TYPES_LEAN`,
    `GET_ALL_ACCOUNTS`,
    `GET_ALL_TRANSACTIONS`,
    `GET_ACCOUNT_TRANSACTIONS`,
    `GET_USER_OVERVIEW`
  ]
}
