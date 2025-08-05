<script lang="ts">
import { Badge } from "$lib/components/ui/badge/index.js"
import { Button } from "$lib/components/ui/button/index.js"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "$lib/components/ui/card/index.js"

const { data }: { data: { error?: string } } = $props()

const errorMessages: Record<string, string> = {
	oauth_failed: "OAuth authentication failed. Please try again.",
	auth_failed: "Authentication failed. Please try again.",
}

function handleGoogleLogin() {
	window.location.href = "/api/auth/login"
}
</script>

<svelte:head>
	<title>Login - Pennywise</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
	<div class="max-w-md w-full space-y-8">
		<!-- Header -->
		<div class="text-center">
			<div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
				<svg class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
				</svg>
			</div>
			<h1 class="mt-6 text-3xl font-bold tracking-tight">
				Welcome to Pennywise
			</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				Your personal finance companion
			</p>
		</div>

		<!-- Login Card -->
		<Card>
			<CardHeader>
				<CardTitle>Sign in to your account</CardTitle>
				<CardDescription>
					Track your expenses, manage budgets, and split bills with friends
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				{#if data.error}
					<div class="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-md">
						<p class="text-sm">
							{errorMessages[data.error] || 'An error occurred. Please try again.'}
						</p>
					</div>
				{/if}

				<Button
					onclick={handleGoogleLogin}
					class="w-full"
					size="lg"
				>
					<svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
						<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					Sign in with Google
				</Button>

				<!-- Features Preview -->
				<div class="pt-4 border-t">
					<h3 class="text-sm font-medium mb-3">What you'll get:</h3>
					<div class="space-y-2">
						<div class="flex items-center text-sm text-muted-foreground">
							<Badge variant="outline" class="mr-2 h-4 w-4 p-0">💰</Badge>
							Expense tracking and budgeting
						</div>
						<div class="flex items-center text-sm text-muted-foreground">
							<Badge variant="outline" class="mr-2 h-4 w-4 p-0">👥</Badge>
							Split bills with friends
						</div>
						<div class="flex items-center text-sm text-muted-foreground">
							<Badge variant="outline" class="mr-2 h-4 w-4 p-0">📊</Badge>
							Financial insights and reports
						</div>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Footer -->
		<div class="text-center">
			<p class="text-xs text-muted-foreground">
				By signing in, you agree to our Terms of Service and Privacy Policy
			</p>
		</div>
	</div>
</div>
