import { PrismaClient } from "@prisma/client"
import { dev } from "$app/environment"

// Prisma Client singleton pattern for development
// Prevents multiple instances during hot reloading
declare global {
	// eslint-disable-next-line no-var
	var __prisma: PrismaClient | undefined
}

export const prisma =
	globalThis.__prisma ||
	new PrismaClient({
		log: dev ? ["query", "error", "warn"] : ["error"],
		// Using the new no-rust engine configuration
		// This is automatically handled by the generator config in schema.prisma
	})

if (dev) {
	globalThis.__prisma = prisma
}

// Graceful shutdown handling
process.on("beforeExit", async () => {
	await prisma.$disconnect()
})

process.on("SIGINT", async () => {
	await prisma.$disconnect()
	process.exit(0)
})

process.on("SIGTERM", async () => {
	await prisma.$disconnect()
	process.exit(0)
})

// Database utility functions
export const DatabaseUtils = {
	/**
	 * Test database connection
	 */
	async testConnection(): Promise<boolean> {
		try {
			await prisma.$queryRaw`SELECT 1`
			return true
		} catch (error) {
			console.error("Database connection failed:", error)
			return false
		}
	},

	/**
	 * Get database statistics
	 */
	async getStats() {
		try {
			const [userCount, accountCount, transactionCount, categoryCount] = await Promise.all([
				prisma.user.count(),
				prisma.account.count(),
				prisma.transaction.count(),
				prisma.category.count(),
			])

			return {
				users: userCount,
				accounts: accountCount,
				transactions: transactionCount,
				categories: categoryCount,
			}
		} catch (error) {
			console.error("Failed to get database stats:", error)
			return null
		}
	},

	/**
	 * Create a sample user for testing
	 */
	async createSampleUser(overrides: { googleId?: string; name?: string; email?: string } = {}) {
		const defaults = {
			googleId: `test_${Date.now()}`,
			name: "Test User",
			email: `test${Date.now()}@pennywise.app`,
		}

		const defaultData = { ...defaults, ...overrides }

		try {
			const user = await prisma.user.create({
				data: defaultData,
			})

			console.log("Created sample user:", user)
			return user
		} catch (error) {
			console.error("Failed to create sample user:", error)
			throw error
		}
	},

	/**
	 * Create sample accounts for a user
	 */
	async createSampleAccounts(userId: string) {
		try {
			const accounts = await Promise.all([
				prisma.account.create({
					data: {
						userId,
						name: "Checking Account",
						type: "BANK",
						currency: "USD",
						initialBalance: 1000.0,
						currentBalance: 1000.0,
						isDefault: true,
					},
				}),
				prisma.account.create({
					data: {
						userId,
						name: "Credit Card",
						type: "CREDIT_CARD",
						currency: "USD",
						initialBalance: 0.0,
						currentBalance: -250.0,
						creditLimit: 5000.0,
						statementDay: 15,
					},
				}),
				prisma.account.create({
					data: {
						userId,
						name: "Savings Account",
						type: "SAVINGS",
						currency: "USD",
						initialBalance: 5000.0,
						currentBalance: 5000.0,
					},
				}),
			])

			console.log("Created sample accounts:", accounts)
			return accounts
		} catch (error) {
			console.error("Failed to create sample accounts:", error)
			throw error
		}
	},

	/**
	 * Create sample categories for a user
	 */
	async createSampleCategories(userId: string) {
		try {
			const categories = await Promise.all([
				// Expense categories
				prisma.category.create({
					data: {
						userId,
						name: "Groceries",
						type: "EXPENSE",
					},
				}),
				prisma.category.create({
					data: {
						userId,
						name: "Dining Out",
						type: "EXPENSE",
					},
				}),
				prisma.category.create({
					data: {
						userId,
						name: "Transportation",
						type: "EXPENSE",
					},
				}),
				prisma.category.create({
					data: {
						userId,
						name: "Utilities",
						type: "EXPENSE",
					},
				}),
				prisma.category.create({
					data: {
						userId,
						name: "Entertainment",
						type: "EXPENSE",
					},
				}),
				// Income categories
				prisma.category.create({
					data: {
						userId,
						name: "Salary",
						type: "INCOME",
					},
				}),
				prisma.category.create({
					data: {
						userId,
						name: "Freelance",
						type: "INCOME",
					},
				}),
			])

			console.log("Created sample categories:", categories)
			return categories
		} catch (error) {
			console.error("Failed to create sample categories:", error)
			throw error
		}
	},

	/**
	 * Create a complete sample dataset for testing
	 */
	async createSampleData(userOverrides?: { googleId?: string; name?: string; email?: string }) {
		try {
			// Create user
			const user = await DatabaseUtils.createSampleUser(userOverrides)

			// Create accounts and categories
			const [accounts, categories] = await Promise.all([
				DatabaseUtils.createSampleAccounts(user.id),
				DatabaseUtils.createSampleCategories(user.id),
			])

			// Create a sample transaction
			const checkingAccount = accounts.find((a) => a.type === "BANK")
			const groceryCategory = categories.find((c) => c.name === "Groceries")

			if (checkingAccount && groceryCategory) {
				const transaction = await prisma.transaction.create({
					data: {
						payerId: user.id,
						accountId: checkingAccount.id,
						amount: -75.5,
						currency: "USD",
						date: new Date(),
						payee: "Whole Foods",
						memo: "Weekly grocery shopping",
						type: "EXPENSE",
					},
				})

				// Create transaction participant
				await prisma.transactionParticipant.create({
					data: {
						transactionId: transaction.id,
						userId: user.id,
						categoryId: groceryCategory.id,
						amount: -75.5,
						status: "SETTLED",
					},
				})

				// Update account balance
				await prisma.account.update({
					where: { id: checkingAccount.id },
					data: { currentBalance: 924.5 },
				})

				console.log("Created sample transaction")
			}

			return {
				user,
				accounts,
				categories,
			}
		} catch (error) {
			console.error("Failed to create sample data:", error)
			throw error
		}
	},

	/**
	 * Clean up all data for testing
	 */
	async cleanup() {
		try {
			// Delete in correct order due to foreign key constraints
			await prisma.transactionParticipant.deleteMany()
			await prisma.transaction.deleteMany()
			await prisma.budget.deleteMany()
			await prisma.scheduledTransaction.deleteMany()
			await prisma.savingsGoal.deleteMany()
			await prisma.payeeRule.deleteMany()
			await prisma.settlement.deleteMany()
			await prisma.investmentHolding.deleteMany()
			await prisma.account.deleteMany()
			await prisma.category.deleteMany()
			await prisma.fXRate.deleteMany()
			await prisma.user.deleteMany()

			console.log("Database cleanup completed")
		} catch (error) {
			console.error("Failed to cleanup database:", error)
			throw error
		}
	},
}
