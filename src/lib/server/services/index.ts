import type { Account, Category, Transaction, User } from "@prisma/client"
import { prisma } from "$lib/server/prisma.js"

export class UserService {
	/**
	 * Find or create a user by Google ID
	 */
	async findOrCreateByGoogleId(
		googleId: string,
		userData: { name: string; email: string },
	): Promise<User> {
		// Try to find existing user
		const existingUser = await prisma.user.findUnique({
			where: { googleId },
		})

		if (existingUser) {
			return existingUser
		}

		// Create new user
		return await prisma.user.create({
			data: {
				googleId,
				name: userData.name,
				email: userData.email,
			},
		})
	}

	/**
	 * Get user with all their financial data
	 */
	async getUserWithFinancialData(userId: string) {
		return prisma.user.findUnique({
			where: { id: userId },
			include: {
				accounts: {
					orderBy: { isDefault: "desc" },
				},
				categories: {
					orderBy: { name: "asc" },
				},
				transactions: {
					take: 10,
					orderBy: { date: "desc" },
					include: {
						account: true,
						participants: {
							include: {
								category: true,
							},
						},
					},
				},
			},
		})
	}
}

export const AccountService = {
	/**
	 * Create a new account
	 */
	async createAccount(data: {
		userId: string
		name: string
		type: Account["type"]
		currency?: string
		initialBalance?: number
		creditLimit?: number
		statementDay?: number
		isDefault?: boolean
	}): Promise<Account> {
		// If this is set as default, unset other defaults
		if (data.isDefault) {
			await prisma.account.updateMany({
				where: { userId: data.userId },
				data: { isDefault: false },
			})
		}

		return prisma.account.create({
			data: {
				...data,
				currentBalance: data.initialBalance || 0,
			},
		})
	},

	/**
	 * Get account balance and recent transactions
	 */
	async getAccountDetails(accountId: string) {
		return prisma.account.findUnique({
			where: { id: accountId },
			include: {
				transactions: {
					take: 20,
					orderBy: { date: "desc" },
					include: {
						participants: {
							include: {
								category: true,
								user: true,
							},
						},
					},
				},
			},
		})
	},

	/**
	 * Update account balance after transaction
	 */
	async updateBalance(accountId: string, amount: number) {
		return prisma.account.update({
			where: { id: accountId },
			data: {
				currentBalance: {
					increment: amount,
				},
			},
		})
	},
}

export const CategoryService = {
	/**
	 * Get or create a category by name
	 */
	async findOrCreateCategory(
		userId: string,
		name: string,
		type: "INCOME" | "EXPENSE" = "EXPENSE",
	): Promise<Category> {
		const existingCategory = await prisma.category.findFirst({
			where: {
				userId,
				name: {
					equals: name,
					mode: "insensitive",
				},
			},
		})

		if (existingCategory) {
			return existingCategory
		}

		return prisma.category.create({
			data: {
				userId,
				name,
				type,
			},
		})
	},

	/**
	 * Get categories with spending totals
	 */
	async getCategoriesWithSpending(userId: string, startDate?: Date, endDate?: Date) {
		const categories = await prisma.category.findMany({
			where: { userId },
			include: {
				transactionParticipants: {
					where: {
						...(startDate &&
							endDate && {
								transaction: {
									date: {
										gte: startDate,
										lte: endDate,
									},
								},
							}),
					},
					include: {
						transaction: true,
					},
				},
			},
		})

		return categories.map((category) => ({
			...category,
			totalSpent: category.transactionParticipants.reduce(
				(sum, participant) => sum + Number(participant.amount),
				0,
			),
			transactionCount: category.transactionParticipants.length,
		}))
	},
}

export const TransactionService = {
	/**
	 * Create a new transaction with participants
	 */
	async createTransaction(data: {
		payerId: string
		accountId: string
		amount: number
		currency?: string
		date: Date
		payee?: string
		memo?: string
		type?: Transaction["type"]
		participants: Array<{
			userId: string
			categoryId?: string
			amount: number
		}>
	}): Promise<Transaction> {
		return prisma.$transaction(async (tx) => {
			// Create the transaction
			const transaction = await tx.transaction.create({
				data: {
					payerId: data.payerId,
					accountId: data.accountId,
					amount: data.amount,
					currency: data.currency || "USD",
					date: data.date,
					payee: data.payee,
					memo: data.memo,
					type: data.type || "EXPENSE",
				},
			})

			// Create participants
			await tx.transactionParticipant.createMany({
				data: data.participants.map((participant) => ({
					transactionId: transaction.id,
					userId: participant.userId,
					categoryId: participant.categoryId,
					amount: participant.amount,
					status: participant.userId === data.payerId ? "SETTLED" : "PENDING",
				})),
			})

			// Update account balance
			await tx.account.update({
				where: { id: data.accountId },
				data: {
					currentBalance: {
						increment: data.amount,
					},
				},
			})

			return transaction
		})
	},

	/**
	 * Get transactions with filters
	 */
	async getTransactions(filters: {
		userId?: string
		accountId?: string
		categoryId?: string
		startDate?: Date
		endDate?: Date
		limit?: number
		offset?: number
	}) {
		const { userId, accountId, categoryId, startDate, endDate, limit = 50, offset = 0 } = filters

		const where = {
			...(userId && { payerId: userId }),
			...(accountId && { accountId }),
			...(startDate &&
				endDate && {
					date: {
						gte: startDate,
						lte: endDate,
					},
				}),
			...(categoryId && {
				participants: {
					some: {
						categoryId,
					},
				},
			}),
		}

		const [transactions, total] = await Promise.all([
			prisma.transaction.findMany({
				where,
				include: {
					account: true,
					participants: {
						include: {
							category: true,
							user: true,
						},
					},
				},
				orderBy: { date: "desc" },
				take: limit,
				skip: offset,
			}),
			prisma.transaction.count({ where }),
		])

		return {
			transactions,
			total,
			hasMore: offset + limit < total,
		}
	},

	/**
	 * Get spending analytics
	 */
	async getSpendingAnalytics(userId: string, startDate: Date, endDate: Date) {
		const transactions = await prisma.transaction.findMany({
			where: {
				payerId: userId,
				date: {
					gte: startDate,
					lte: endDate,
				},
				type: "EXPENSE",
			},
			include: {
				participants: {
					include: {
						category: true,
					},
				},
			},
		})

		// Group by category
		const categorySpending = new Map<
			string,
			{
				name: string
				amount: number
				count: number
			}
		>()

		for (const transaction of transactions) {
			for (const participant of transaction.participants) {
				if (participant.categoryId) {
					const categoryName = participant.category?.name || "Uncategorized"
					const existing = categorySpending.get(categoryName) || {
						name: categoryName,
						amount: 0,
						count: 0,
					}

					existing.amount += Math.abs(Number(participant.amount))
					existing.count += 1
					categorySpending.set(categoryName, existing)
				}
			}
		}

		const totalSpent = Array.from(categorySpending.values()).reduce(
			(sum, cat) => sum + cat.amount,
			0,
		)

		return {
			totalSpent,
			transactionCount: transactions.length,
			categories: Array.from(categorySpending.values()).sort((a, b) => b.amount - a.amount),
		}
	},
}
