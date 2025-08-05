<script lang="ts">
import {
	DollarSign,
	LogOut,
	PlusCircle,
	Settings,
	TrendingDown,
	TrendingUp,
	User,
} from "lucide-svelte"
import { Avatar, AvatarFallback } from "$lib/components/ui/avatar/index.js"
import { Badge } from "$lib/components/ui/badge/index.js"
import { Button } from "$lib/components/ui/button/index.js"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "$lib/components/ui/card/index.js"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "$lib/components/ui/dropdown-menu/index.js"
import { Separator } from "$lib/components/ui/separator/index.js"

const { data }: { data: App.ProtectedPageData } = $props()

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
}

async function logout() {
	await fetch("/api/auth/logout", { method: "POST" })
	window.location.href = "/login"
}
</script>

<svelte:head>
	<title>Pennywise - Personal Finance Tracker</title>
</svelte:head>

<div class="min-h-screen bg-background">
	{#if data.user}
		<!-- Header -->
		<header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div class="container flex h-14 items-center">
				<div class="mr-4 flex">
					<a class="mr-6 flex items-center space-x-2" href="/">
						<DollarSign class="h-6 w-6" />
						<span class="font-bold">Pennywise</span>
					</a>
				</div>
				<div class="flex flex-1 items-center space-x-2">
					<nav class="flex items-center space-x-6 text-sm font-medium">
						<a href="/" class="transition-colors hover:text-foreground/80 text-foreground">
							Dashboard
						</a>
						<a href="/expenses" class="transition-colors hover:text-foreground/80 text-foreground/60">
							Expenses
						</a>
						<a href="/budgets" class="transition-colors hover:text-foreground/80 text-foreground/60">
							Budgets
						</a>
						<a href="/split-bills" class="transition-colors hover:text-foreground/80 text-foreground/60">
							Split Bills
						</a>
					</nav>
				</div>
				<div class="flex items-center justify-between space-x-2 md:justify-end">
					<nav class="flex items-center">
						<DropdownMenu>
							<DropdownMenuTrigger>
								{#snippet child({ props })}
									<Button variant="ghost" class="relative h-8 w-8 rounded-full" {...props}>
										<Avatar class="h-8 w-8">
											<AvatarFallback>{getInitials(data.user.name)}</AvatarFallback>
										</Avatar>
									</Button>
								{/snippet}
							</DropdownMenuTrigger>
							<DropdownMenuContent class="w-56" align="end">
								<div class="flex items-center justify-start gap-2 p-2">
									<div class="flex flex-col space-y-1 leading-none">
										<p class="font-medium">{data.user.name}</p>
										<p class="w-[200px] truncate text-sm text-muted-foreground">
											{data.user.email}
										</p>
									</div>
								</div>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<User class="mr-2 h-4 w-4" />
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Settings class="mr-2 h-4 w-4" />
									<span>Settings</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onclick={logout}>
									<LogOut class="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<div class="container mx-auto px-4 py-8">
			<!-- Welcome Section -->
			<div class="mb-8">
				<h1 class="text-3xl font-bold tracking-tight">
					Welcome back, {data.user.name.split(' ')[0]}!
				</h1>
				<p class="text-muted-foreground">
					Here's an overview of your finances
				</p>
			</div>

			<!-- Stats Grid -->
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Total Balance</CardTitle>
						<DollarSign class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">$2,345.67</div>
						<p class="text-xs text-muted-foreground">
							+20.1% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Monthly Expenses</CardTitle>
						<TrendingDown class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">$1,234.56</div>
						<p class="text-xs text-muted-foreground">
							-12.5% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Monthly Income</CardTitle>
						<TrendingUp class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">$3,456.78</div>
						<p class="text-xs text-muted-foreground">
							+5.2% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">Active Budgets</CardTitle>
						<Badge variant="secondary">3</Badge>
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">3</div>
						<p class="text-xs text-muted-foreground">
							2 on track, 1 over budget
						</p>
					</CardContent>
				</Card>
			</div>

			<!-- Quick Actions -->
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<PlusCircle class="h-5 w-5" />
							Quick Add Expense
						</CardTitle>
						<CardDescription>
							Track a new expense quickly
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button class="w-full">Add Expense</Button>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Recent Transactions</CardTitle>
						<CardDescription>
							Your latest financial activity
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="space-y-2">
							<div class="flex justify-between items-center text-sm">
								<span>Coffee Shop</span>
								<span class="text-red-600">-$4.50</span>
							</div>
							<Separator />
							<div class="flex justify-between items-center text-sm">
								<span>Salary</span>
								<span class="text-green-600">+$3,000.00</span>
							</div>
							<Separator />
							<div class="flex justify-between items-center text-sm">
								<span>Grocery Store</span>
								<span class="text-red-600">-$85.23</span>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Budget Status</CardTitle>
						<CardDescription>
							How you're doing this month
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="space-y-2">
							<div class="flex justify-between items-center text-sm">
								<span>Food & Dining</span>
								<Badge variant="outline">68% used</Badge>
							</div>
							<div class="flex justify-between items-center text-sm">
								<span>Transportation</span>
								<Badge variant="outline">45% used</Badge>
							</div>
							<div class="flex justify-between items-center text-sm">
								<span>Entertainment</span>
								<Badge variant="destructive">105% used</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	{:else}
		<!-- Not authenticated -->
		<div class="min-h-screen flex items-center justify-center">
			<Card class="w-[350px]">
				<CardHeader>
					<CardTitle>Loading...</CardTitle>
					<CardDescription>
						If you see this, something went wrong with authentication.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button variant="outline" onclick={() => window.location.href = '/login'}>
						Go to Login
					</Button>
				</CardContent>
			</Card>
		</div>
	{/if}
</div>
