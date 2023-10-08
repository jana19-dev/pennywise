import { PrismaClient } from "@prisma/client"
import csv from "csvtojson"

const prisma = new PrismaClient()

const authUser = await prisma.user.findUnique({
  where: {
    email: `xxx`
  },
  select: {
    id: true
  }
})

const accountId = `xxx`

const where = { userId: authUser.id, accountId }

const transactionsFromSystem = await prisma.transaction.findMany({
  where,
  orderBy: [{ date: `desc` }],
  select: {
    id: true,
    date: true,
    payee: {
      select: {
        id: true,
        name: true
      }
    },
    transferFrom: {
      select: {
        amount: true
      }
    },
    amount: true,
    memo: true
  }
})

console.log(`Total transactions from account:`, transactionsFromSystem.length)

console.log(`System transactions:`, transactionsFromSystem[0])

const transactionsFromCSV = await csv({
  trim: true,
  checkType: true
}).fromFile(`scripts/data.csv`)

console.log(`Total transactions from csv:`, transactionsFromCSV.length)

// loop through both transactions and compare the difference
const missingTransactions = []
const matchedTransactions = []
let remainingTransactions = [...transactionsFromSystem]
for (const transactionFromCSV of transactionsFromCSV) {
  const transactionFromSystem = remainingTransactions.find((transactionFromSystem) => {
    const isSameAmountExpense =
      Math.abs(parseFloat(typeof transactionFromCSV.Cardholder === `string` ? transactionFromCSV.Amount : transactionFromCSV.Cardholder)) ==
      Math.abs(parseFloat(transactionFromSystem.amount))
    return isSameAmountExpense
  })
  if (!transactionFromSystem) {
    missingTransactions.push(transactionFromCSV)
  } else {
    matchedTransactions.push(transactionFromSystem.id)
    remainingTransactions = remainingTransactions.filter((transaction) => transaction.id !== transactionFromSystem.id)
  }
}

console.log(`Total missing transactions:`, missingTransactions.length)
console.table(missingTransactions)

console.log(`Total remaining transactions:`, remainingTransactions.length)
console.table(remainingTransactions)
