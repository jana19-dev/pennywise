import type { RequestHandler } from "@sveltejs/kit"
import { json } from "@sveltejs/kit"
import { DatabaseUtils, prisma } from "$lib/server/prisma.js"

export const GET: RequestHandler = async () => {
	try {
		// Test database connection
		const isConnected = await DatabaseUtils.testConnection()

		if (!isConnected) {
			return json(
				{
					success: false,
					error: "Database connection failed",
				},
				{ status: 500 },
			)
		}

		// Get initial stats
		const initialStats = await DatabaseUtils.getStats()

		// Create sample data
		const sampleData = await DatabaseUtils.createSampleData({
			googleId: "test_pennywise_user",
			name: "Pennywise Test User",
			email: "test@pennywise.app",
		})

		// Get updated stats
		const finalStats = await DatabaseUtils.getStats()

		// Test some queries
		const userWithRelations = await prisma.user.findUnique({
			where: { id: sampleData.user.id },
			include: {
				accounts: {
					include: {
						transactions: {
							include: {
								participants: {
									include: {
										category: true,
									},
								},
							},
						},
					},
				},
				categories: true,
			},
		})

		// Test aggregation queries
		const accountBalances = await prisma.account.aggregate({
			where: { userId: sampleData.user.id },
			_sum: { currentBalance: true },
			_count: true,
		})

		// Test transaction queries with complex filtering
		const recentTransactions = await prisma.transaction.findMany({
			where: {
				payerId: sampleData.user.id,
				date: {
					gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
				},
			},
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
		})

		return json({
			success: true,
			message: "Prisma test completed successfully!",
			data: {
				connection: isConnected,
				initialStats,
				finalStats,
				sampleUser: {
					id: sampleData.user.id,
					name: sampleData.user.name,
					email: sampleData.user.email,
					accountsCount: sampleData.accounts.length,
					categoriesCount: sampleData.categories.length,
				},
				userWithRelations: {
					id: userWithRelations?.id,
					name: userWithRelations?.name,
					accountsCount: userWithRelations?.accounts.length,
					categoriesCount: userWithRelations?.categories.length,
					totalTransactions: userWithRelations?.accounts.reduce(
						(sum, acc) => sum + acc.transactions.length,
						0,
					),
				},
				accountBalances,
				recentTransactions: recentTransactions.map((t) => ({
					id: t.id,
					amount: t.amount,
					payee: t.payee,
					memo: t.memo,
					date: t.date,
					account: t.account.name,
					participants: t.participants.map((p) => ({
						amount: p.amount,
						category: p.category?.name,
						user: p.user.name,
					})),
				})),
			},
		})
	} catch (error) {
		console.error("Prisma test error:", error)
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			},
			{ status: 500 },
		)
	}
}

export const DELETE: RequestHandler = async () => {
	try {
		await DatabaseUtils.cleanup()

		const stats = await DatabaseUtils.getStats()

		return json({
			success: true,
			message: "Database cleanup completed",
			stats,
		})
	} catch (error) {
		console.error("Cleanup error:", error)
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Cleanup failed",
			},
			{ status: 500 },
		)
	}
}
