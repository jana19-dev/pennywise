import type { RequestHandler } from "@sveltejs/kit"
import { json } from "@sveltejs/kit"
import {
	AccountService,
	CategoryService,
	TransactionService,
	UserService,
} from "$lib/server/services/index.js"

const userService = new UserService()

export const GET: RequestHandler = async () => {
	try {
		// Clean start - let's test our services

		// 1. Test UserService
		const testUser = await userService.findOrCreateByGoogleId("service_test_user", {
			name: "Service Test User",
			email: "servicetest@pennywise.app",
		})

		// 2. Test CategoryService
		const groceryCategory = await CategoryService.findOrCreateCategory(
			testUser.id,
			"Groceries",
			"EXPENSE",
		)

		const salaryCategory = await CategoryService.findOrCreateCategory(
			testUser.id,
			"Salary",
			"INCOME",
		)

		// 3. Test AccountService
		const checkingAccount = await AccountService.createAccount({
			userId: testUser.id,
			name: "Test Checking",
			type: "BANK",
			currency: "USD",
			initialBalance: 2000,
			isDefault: true,
		})

		const creditCard = await AccountService.createAccount({
			userId: testUser.id,
			name: "Test Credit Card",
			type: "CREDIT_CARD",
			currency: "USD",
			initialBalance: 0,
			creditLimit: 3000,
			statementDay: 15,
		})

		// 4. Test TransactionService
		const expenseTransaction = await TransactionService.createTransaction({
			payerId: testUser.id,
			accountId: checkingAccount.id,
			amount: -85.42,
			date: new Date(),
			payee: "Target",
			memo: "Household supplies",
			type: "EXPENSE",
			participants: [
				{
					userId: testUser.id,
					categoryId: groceryCategory.id,
					amount: -85.42,
				},
			],
		})

		const incomeTransaction = await TransactionService.createTransaction({
			payerId: testUser.id,
			accountId: checkingAccount.id,
			amount: 2500.0,
			date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
			payee: "ACME Corp",
			memo: "Salary deposit",
			type: "INCOME",
			participants: [
				{
					userId: testUser.id,
					categoryId: salaryCategory.id,
					amount: 2500.0,
				},
			],
		})

		// 5. Test analytics
		const analytics = await TransactionService.getSpendingAnalytics(
			testUser.id,
			new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
			new Date(),
		)

		// 6. Test account details
		const accountDetails = await AccountService.getAccountDetails(checkingAccount.id)

		// 7. Test user with financial data
		const userWithData = await userService.getUserWithFinancialData(testUser.id)

		// 8. Test transactions with filters
		const recentTransactions = await TransactionService.getTransactions({
			userId: testUser.id,
			limit: 10,
		})

		// 9. Test categories with spending
		const categoriesWithSpending = await CategoryService.getCategoriesWithSpending(
			testUser.id,
			new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
			new Date(),
		)

		return json({
			success: true,
			message: "All services tested successfully!",
			data: {
				user: {
					id: testUser.id,
					name: testUser.name,
					email: testUser.email,
				},
				accounts: {
					checking: {
						id: checkingAccount.id,
						name: checkingAccount.name,
						balance: checkingAccount.currentBalance,
						isDefault: checkingAccount.isDefault,
					},
					creditCard: {
						id: creditCard.id,
						name: creditCard.name,
						balance: creditCard.currentBalance,
						creditLimit: creditCard.creditLimit,
					},
				},
				categories: {
					grocery: {
						id: groceryCategory.id,
						name: groceryCategory.name,
						type: groceryCategory.type,
					},
					salary: {
						id: salaryCategory.id,
						name: salaryCategory.name,
						type: salaryCategory.type,
					},
				},
				transactions: {
					expense: {
						id: expenseTransaction.id,
						amount: expenseTransaction.amount,
						payee: expenseTransaction.payee,
					},
					income: {
						id: incomeTransaction.id,
						amount: incomeTransaction.amount,
						payee: incomeTransaction.payee,
					},
				},
				analytics: {
					totalSpent: analytics.totalSpent,
					transactionCount: analytics.transactionCount,
					topCategories: analytics.categories.slice(0, 3),
				},
				accountDetails: {
					name: accountDetails?.name,
					balance: accountDetails?.currentBalance,
					transactionCount: accountDetails?.transactions.length,
				},
				userSummary: {
					accountsCount: userWithData?.accounts.length,
					categoriesCount: userWithData?.categories.length,
					recentTransactionsCount: userWithData?.transactions.length,
				},
				recentTransactions: {
					total: recentTransactions.total,
					count: recentTransactions.transactions.length,
					hasMore: recentTransactions.hasMore,
				},
				categoriesWithSpending: categoriesWithSpending.map((cat) => ({
					name: cat.name,
					totalSpent: cat.totalSpent,
					transactionCount: cat.transactionCount,
				})),
			},
		})
	} catch (error) {
		console.error("Service test error:", error)
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Service test failed",
			},
			{ status: 500 },
		)
	}
}
