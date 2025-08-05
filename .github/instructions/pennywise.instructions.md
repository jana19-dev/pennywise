Pennywise Development Plan (Step-by-Step Implementation Guide)

Checklist of Major Development Steps (for progress tracking):
	•	Project Initialization & Tooling Setup – SvelteKit project, pnpm, Tailwind, Prisma, Firebase, Biome, Husky, etc.
	• Use the latest SvelteKit Async & Remote Functions – Enable experimental async components and remote functions for more intuitive data loading and mutations.
		- https://svelte.dev/docs/kit/remote-functions
		- https://svelte.dev/docs/svelte/await-expressions
	•	Database Schema with Prisma – Design models (User, Account, Category, Transaction, Participant, Settlement, Budget, etc.) and run migrations.
	•	Authentication (Firebase OAuth) – Integrate Google Sign-In, set up SvelteKit hooks for session, and protect routes.
	•	Layout & Navigation Shell – Create persistent sidebar nav (accounts list, sections), responsive design, theme toggle.
	•	Accounts Management – CRUD for accounts (add/edit/delete), show balances, support different account types, hide/archive unused accounts.
	•	Categories Management – CRUD for categories, possibly merge or delete with confirmation if in use.
	•	Transactions CRUD & Listing – List transactions with filters (by account, date), add/edit/delete transactions (with form actions).
	•	Budgeting Feature – Set monthly budgets per category, track spending vs allocated, show progress/remaining.
	•	Shared Expenses (Splitting) – Support transactions split among multiple users (TransactionParticipants model), mark owed amounts.
	•	Debt Settlements – Allow users to settle up shared expenses (record payments, update balances, create Settlement records).
	•	Settlements History Page – List all settlements (paid and received), with details and export option.
	•	Import Transactions Tool – Upload CSV/OFX, map fields to transactions, preview and import data (with auto-categorization rules).
	•	Split Transactions by Category – UI to split a single transaction into multiple category entries for one user’s budget.
	•	Scheduled Transactions & Reminders – Manage recurring transactions (bills/income), remind user and allow marking as paid (auto-create transaction).
	•	Investments & Multi-Currency – Track investment account holdings and live values, handle accounts in different currencies (FX rates, conversion for totals).
	•	Dashboard Overview – Summary page (net worth, total balances, budget summary, upcoming bills, shared balances snapshot, quick-add shortcuts).
	•	AI Insights Integration – Use AI (e.g. OpenAI API) to analyze spending and provide personalized financial tips and warnings.
	•	Savings Goals Feature – Allow users to create savings goals (target amount by due date) and track progress towards each goal.
	•	UI/UX Enhancements – Improve interface: use dialog modals for forms, always-visible summary bar of key info, snappier interactions.
	•	Reports & Charts – Add visual reports (spending trends, category breakdown, net worth over time) using shadcn-svelte chart components.
	•	Final Testing, Optimization & Deployment – Thorough testing, performance tuning, PWA setup, Docker containerization, and deployment.

⸻

1. Project Initialization and Tooling

Set up the project and development tools:
	•	Initialize SvelteKit: Create a new SvelteKit app (latest version). Use pnpm for package management (e.g. pnpm dlx create-svelte@latest pennywise). Choose the Skeleton project with TypeScript. Ensure the development environment uses Node.js 18+ (preferably Node 24) for compatibility with latest features.
	•	Install UI Libraries: Add Tailwind CSS (v4).  Install the shadcn-svelte component library for pre-built UI components and themes. This will provide ready-made components (buttons, dialogs, forms, etc.) and a set of blocks (layout pieces) we can use for faster UI development.
	•	Auth & Firebase: Install Firebase SDK packages (for Authentication and possibly Firestore if needed for other features). We’ll use Firebase Auth for Google OAuth on the client side only.
	•	Backend & DB: Install Prisma ORM and the PostgreSQL client (e.g. pnpm add -D prisma && pnpm prisma init). Set up a local PostgreSQL database and put the connection URL in an .env file. The Prisma schema will be defined in the next step.
	•	Code Quality: Install Biome (an all-in-one linter/formatter) and configure it. Since Biome can replace ESLint+Prettier, set up a Biome config if needed or use default. Set up Husky and lint-staged for pre-commit hooks: configure a pre-commit hook that runs Biome to format and lint staged files, ensuring code style consistency on each commit. (Biome’s docs provide recipes for Husky + lint-staged integration; essentially, add a husky config and a lint-staged section in package.json to run biome format or biome check --write on staged files before commit.)
	•	Project Config: Update svelte.config.js to use the Node adapter (e.g. @sveltejs/adapter-node) for deployment as a Node server (e.g. in Docker). Also, enable any experimental features in the config if we plan to use them later (for example, we might toggle on experimental: { inspector: true } for debugging, and enable remoteFunctions). Create environment config .env to store secrets like DATABASE_URL, Firebase API keys, etc. (Do not commit these).
	•	Git Repository: Use the existing repository new branch. This sets the foundation to track changes at each step.  As we progress through steps, we can create feature branches or at least commit at the end of each major step, making it easy to track progress and rollback if needed.

2. Database Schema with Prisma

Design the database schema using Prisma, covering all core entities. Edit schema.prisma to define models for each concept, then run migrations:
	•	User: Fields: id (UUID or auto-increment int), googleId (string, to link with Google OAuth user), name, email, createdAt (DateTime). The googleId is important to map the Google authenticated user to our local user data.
	•	Account: Represents a financial account (cash, bank account, credit card, investment account, etc.). Fields: id, userId (relation to User), name, type (enum: e.g. CASH, BANK, CREDIT_CARD, INVESTMENT), currency (string, e.g. “USD”, “CAD”), initialBalance (Decimal), and perhaps currentBalance (Decimal). We might also include fields like creditLimit (for credit cards) or statementDay and statementDueDay for credit cycle info. Relations: user relation (many accounts per user), and possibly transactions relation (one-to-many). Note: We will consider later if we want to update currentBalance on each transaction or compute on the fly. Initially, we might maintain it for quick display.
	•	Hiding accounts: Anticipating a feature to hide or archive accounts, we can include a boolean field isHidden (default false) to mark accounts that should be excluded from summary views. (If not added now, we can add it in a later migration when implementing the hide feature in the UI.)
	•	Category: Represents a transaction category (e.g. Groceries, Rent, Salary). Fields: id, userId (the owner user; categories are user-specific), name, and optionally type (enum or boolean to distinguish income vs expense categories, if useful). Relations: many categories per user.
	•	Transaction: A financial transaction record (the top-level record of an expense, income, or transfer). Fields: id, payerId (User who paid if this is a shared expense; for personal transactions this would just be the user), accountId (the Account from which money was spent or received), amount (Decimal, positive for income, negative for expense, or we can use separate field/type), currency (could default to account’s currency), date (Date), payee (string, e.g. merchant or source), memo (string, optional notes), and perhaps type (enum: INCOME, EXPENSE, TRANSFER). Relations: account (each transaction is linked to an Account), payer (linked to User).
	•	We will handle splits and shared participants via a separate model (TransactionParticipant), so the Transaction represents the whole event. For example, a $100 dinner that Alice paid for and split with Bob is one Transaction of $100 on Alice’s credit card, payerId = Alice. The breakdown for Alice and Bob will be in TransactionParticipant.
	•	TransactionParticipant: Represents an individual’s share of a transaction. Fields: id, transactionId (relation to Transaction), userId (which user this portion belongs to – for personal transactions this will be the same as payer; for shared, this includes others), categoryId (each participant can categorize their share), amount (Decimal, the portion of the transaction amount this user is responsible for, could be negative for expense from their perspective or always positive and infer sign from Transaction type), status (enum: e.g. PENDING, SETTLED – used for shared expenses to mark if this portion is unpaid or has been settled), and settlementId (nullable, relation to a Settlement record when this share is settled).
	•	The sum of all participants’ amount for a transaction should equal the Transaction’s amount. For a single-user transaction, we’ll usually create one participant equal to the full amount. For a shared expense, multiple participants: e.g. if Alice paid $100 for dinner with Bob, Transaction amount = 100, TransactionParticipants might be (Alice: $60, Bob: $40). Bob’s share would be marked PENDING (he owes Alice $40). Alice’s own share might be considered settled (or not pending) since she paid it.
	•	Settlement: Represents a settlement of debts between two users (a payment to clear pending shared expenses). Fields: id, fromUserId (User who paid in the settlement), toUserId (User who received the payment), date (Date of settlement), amount (Decimal amount paid), accountId (the Account from which the payment was made, e.g. cash or bank for the payer), and note (string, optional memo or reference). Relations: none many-to-many directly, but TransactionParticipants will link to Settlement via settlementId. Essentially, when a settlement is recorded, one or more TransactionParticipant entries with status PENDING will be updated to reference this Settlement (marking them as settled by this payment).
	•	Budget: Represents a budget allocation for a given user, category, and month. Fields: id, userId, categoryId, year (number or part of a date), month (number 1-12, or could use a date field representing first of month), allocatedAmount (Decimal). There will be one Budget record per category per month (if the user set a budget for that category and month). We will calculate spending against this by summing transactions in that category and time period.
	•	PayeeRule (optional, for auto-categorization): Fields: id, userId, pattern (string or regex to match payee/description), categoryId (to assign by default). This will help during import or quick entry to suggest a category based on payee text. This is an optional enhancement for user convenience.
	•	FXRate (optional, for currency conversion): Fields: id, fromCurrency, toCurrency, rate (Decimal), date. This could store exchange rates for currency conversions. Alternatively, we might not need a full model if we fetch on the fly, but storing historical rates can help for accurate historical calculations.

After defining the schema, run pnpm prisma migrate dev --name init_schema to create the initial migration and apply it to the development database. This will create the tables for all the models. Generate the Prisma client (pnpm prisma generate) so it can be used in the SvelteKit server code.

Note: We will likely extend the schema as new features are added (e.g., adding a SavingsGoal model in a later step, adding an isHidden field to Account, etc.). Prisma makes it easy to evolve the schema with new migrations for those features.

3. Authentication with Firebase (Google OAuth)

Implement Firebase Authentication for user login and ensure SvelteKit recognizes the logged-in user:
	•	Firebase Setup: Create a Firebase project in the Firebase console. Enable Google Sign-In as a provider under Authentication. Obtain the Firebase config keys (apiKey, authDomain, projectId, etc.) and include them in the app (e.g., in a client-side config or .env for sensitive parts). Also set up a Firebase Service Account if using the Admin SDK on the server (this will provide credentials JSON for server-side verification).
	•	Auth UI: Create a login page (/login route). Include a “Sign in with Google” button. Use Firebase Web SDK in the client: initialize Firebase app with config, then use signInWithPopup or signInWithRedirect for GoogleAuthProvider. This will handle the Google OAuth flow and sign the user in on the client side, obtaining a Firebase ID Token (JWT) for the user.
	•	SvelteKit Hooks for Auth: Use SvelteKit’s hooks (src/hooks.server.ts) to establish server-side auth on each request. Specifically, on each request, check if the client has sent a session cookie or authorization header containing the Firebase ID Token. If so, use Firebase Admin SDK (or Firebase’s REST API) to verify the token’s signature and decode it. This yields the Firebase uid and user info. With that, look up or create a corresponding User in our database:
	•	On first login, create a new User record (with googleId = uid, name, email from token) and store its ID.
	•	Store the user’s ID in the session (depending on SvelteKit version, this could be in event.locals or using cookie session). We can set an HttpOnly cookie with a session ID or the token, or since the token can serve as auth, we might just keep verifying it each time (though that’s slightly expensive – a session cookie signed by our server might be better after initial verify).
	•	For simplicity, we might use the Firebase ID token on each request (sent via Authorization header by the client after login) and verify it in the handle hook, then set event.locals.user with our DB user info.
	•	Protecting Routes: Use SvelteKit’s load functions or handle hook to redirect unauthorized users. For example, in hooks.server.ts, if event.locals.user is not set (not logged in) and the route is a private page, you can throw a redirect to /login. Alternatively, use +page.server.js load to check locals.user and redirect. The layout can also check and redirect if user is missing.
	•	Logout: Implement a logout action – e.g., call firebase.auth().signOut() on client and remove the session cookie on server. Possibly provide a /logout route that clears cookies then redirects.
	•	Testing Auth: Manually test the OAuth flow. Start the app, go to /login, click the Google button, ensure it prompts Google login and then returns to the app as logged in (Firebase will provide the token). Verify that a new User record is created in the database. Test that you cannot access an internal page like /dashboard when not logged in (you should get redirected). After login, you can access it. Also test logging out.
	•	Security: Ensure that Firebase ID token verification uses the Firebase project’s public keys (the Admin SDK does this). Consider token expiration (Firebase tokens last ~1 hour). Implement token refresh on client (Firebase SDK handles this if using onAuthStateChanged). Make sure to handle the case where token expired and user needs to login again or refresh.
	•	From here on, all server-side actions (Prisma queries, etc.) will use event.locals.user to get the current user’s ID and filter data accordingly, ensuring each user only accesses their own data.

4. Layout and Navigation Shell

Create the base UI layout that persists across pages, including a sidebar for navigation and a top summary bar:
	•	Global Layout: In src/routes/+layout.svelte, define the main structure of the app. Likely a flex or grid with a sidebar and a content area. For example: a sidebar <nav> taking up a left column, and a main <div> for page content. Apply Tailwind classes for height (full screen), background colors (maybe a dark sidebar, light content area, or according to theme), and responsive behavior.
	•	The layout can also include a top navbar or header section above the content (or a bottom footer) if needed. For now, a top bar might hold a page title or user menu.
	•	Sidebar Navigation: Populate the sidebar with navigation links for the main sections of the app:
	•	Dashboard (overview), Transactions, Accounts, Budgets, Shared (for shared expenses), Settlements, Reports, Import/Tools, Settings. This is a lot, so organize with labels or groups.
	•	Use shadcn-svelte components for a consistent UI: e.g., <Accordion> or <Collapsible> for grouping sections. One group could be “Expenses” containing Transactions, Budgets, Reports, etc. Another for “Shared” containing Shared Expenses and Settlements. Or simply list them with icons.
	•	Under Accounts, display a nested list of the user’s accounts. We can show each account’s name and current balance. This might be a collapsible section (“Accounts ▼”) which reveals the list of accounts. Consider using a smaller font or indentation for account items. We will update this list dynamically when accounts are added or edited.
	•	For each account in the sidebar, if it’s of type credit card, maybe display the balance in red if it’s a debt, etc., or an icon indicating type. For now, just show name (maybe truncated) and balance. If an account is marked hidden (isHidden == true), do not show it here (or perhaps have a separate toggle to show hidden ones in settings).
	•	Active Link Highlight: Use SvelteKit’s $page.url or $page.route.id to determine which section is active and style the corresponding nav item (e.g., apply a different background or text color). This helps users know where they are. For example, if current route starts with /transactions, highlight the Transactions link.
	•	Responsive Design: Ensure the layout works on mobile screens:
	•	The sidebar might collapse into a hamburger menu or a bottom tab bar on small devices. With Tailwind, we can use utilities like hidden md:block to hide the sidebar on mobile and show a top nav or menu button instead. Possibly implement a mobile drawer: a hamburger icon in the top bar that toggles the sidebar visibility.
	•	Test by resizing: on mobile width, content should still be accessible (maybe the sidebar is off-canvas). The shadcn-svelte library might have a Drawer or Sheet component that can be used to show the menu on mobile when needed.
	•	Theme (Dark Mode): Using Tailwind’s dark mode class strategy, set up the ability to toggle dark/light. The shadcn-svelte components support dark mode, so include a toggle (maybe a button in the sidebar or top bar) to switch theme (perhaps storing preference in localStorage or user settings).
	•	Summary Bar: Plan for a persistent summary/status bar in the layout. We want to always display key financial info at a glance. This could be at the top of the content area (below any header) or at the bottom as a fixed footer. For now, consider placing it at the top of the main content area:
	•	This bar can show total balances or a quick summary of accounts. For example, show total cash, total debt, net worth, or list a few important accounts with their balances.
	•	Another approach is to list each active account with its balance in this bar, possibly scrollable if many. Because the user may hide some accounts, only include those not hidden. This way, even if they’re on the transactions page, they can always see their current balances.
	•	We will implement this fully in a later step, but keep the layout ready to include a component for this summary bar. Possibly use a shadcn-svelte Card or Toolbar component styled as a bar.
	•	Placeholder Pages: For each nav link, create a basic page component (e.g., routes/dashboard/+page.svelte, routes/transactions/+page.svelte, etc.) with a simple header text. This allows testing navigation. For multi-segment pages (like accounts which might have subpages for detail), just create the main list page now.
	•	Testing Layout: Run the app and navigate to ensure:
	•	Sidebar appears with all sections and accounts listed.
	•	Clicking links changes the page (SvelteKit will load the new route).
	•	The sidebar remains while content changes (since it’s in layout).
	•	On mobile view, test that the sidebar is hidden or toggle-able. If not yet implemented, note to fix in polish step.
	•	Theme toggle switches colors if implemented.

5. Account Management Feature

Implement the Accounts section where users can view and manage their financial accounts:
	•	Accounts Page (/accounts): Create a page (routes/accounts/+page.svelte and maybe +page.server.ts for data) that lists all accounts for the logged-in user. Use Prisma in the load function (or server load) to fetch event.locals.user.id’s accounts, sorted by maybe name or type.
	•	Display each account in a table or card list. Show: Name, Type (maybe as an icon or label), Currency, and Current Balance. If multi-currency accounts exist, you might also show the balance converted to the user’s primary currency in parentheses (this can be done if FX rates are available; for now, maybe skip conversion until later).
	•	If many accounts, consider grouping by type (all bank accounts together, etc.) or showing totals by type. That can be added later or on dashboard.
	•	Add Account: Provide a button “Add Account”. When clicked, instead of navigating away, use a dialog modal (from shadcn-svelte’s Dialog component) for the form. The form fields:
	•	Name (text), Type (dropdown with options: Cash, Bank, Credit Card, Investment, etc.), Currency (dropdown or text, default from user’s locale, e.g. “USD”), Initial Balance (number/decimal). If type is Credit Card, initial balance might be the current outstanding (could default to 0 if just opening a new card).
	•	Use SvelteKit form actions to handle form submission (+page.server.ts or a dedicated +actions.ts). For instance, define an action createAccount that reads the form data, validates it (ensure name is not empty, etc.), and then uses Prisma to create a new Account (with userId from locals).
	•	After creation, you can either redirect back to /accounts (the page will then show the new account) or, if using the same page with an action, the page can load the updated list. SvelteKit form actions allow staying on the same page and using the returned data to update the UI. With JavaScript enabled, the dialog can close and the list updates without full reload (progressive enhancement courtesy of SvelteKit’s enhancement).
	•	Edit Account: Each account item could have an “Edit” option (e.g., an icon or a button). Clicking it opens a similar dialog pre-filled with the account’s current data. Implement an editAccount form action. This action should verify the user owns the account (perhaps by filtering update query on userId and id) and then update fields. Upon success, update the list (the changes should reflect, e.g., name change or balance change).
	•	If account type is changed or currency changed, consider any implications (for now, it’s okay to allow since it’s just meta info; if there were transactions, changing currency could be problematic, but we assume user won’t do that arbitrarily).
	•	Delete Account: Provide a delete/remove option (maybe a trash icon). When triggered, show a confirmation dialog (“Are you sure? If the account has transactions, they will also be deleted or orphaned.”). Handle via a deleteAccount action.
	•	For safety, you might enforce that an account with existing transactions cannot be deleted (or require the user to delete those transactions first) to maintain data integrity. Or you implement cascade delete in Prisma (e.g., if you set onDelete cascading for transactions). Simpler: prevent deletion if transactions exist, and instead offer an “Archive” which just hides it (we have that via isHidden).
	•	Alternatively, implement archiving: instead of full deletion, mark isHidden=true and perhaps rename the account as archived. This way data stays for records but is not active. Since we plan a hide feature, the UI could simply treat deletion as archiving for non-empty accounts.
	•	Default Account: Optionally, let the user mark one account as the default for new transactions. This could be a star icon toggle. Add a boolean field isDefault to Account or store default account id in User’s profile. If implementing, ensure only one account can be default at a time (when user sets one default, remove default flag from others). In UI, highlight the default account (e.g., a ⭐ next to name).
	•	Account Details: We might later implement an account detail page (showing all transactions for that account, maybe graphs). For now, clicking an account in the list could go to /accounts/[id] page (even if just placeholder). This can be added when doing the transactions list filter or in reports.
	•	Hide/Show Account: If an account is not in active use, allow user to hide it from main views. Implement this by a simple toggle field isHidden (which we included or migrate now if not). In the accounts list, you can have a checkbox or button “Hide” for each account. If clicked, call an action to update isHidden=true. Hidden accounts would:
	•	Not appear in the sidebar accounts list or summary bar.
	•	Possibly appear in the Accounts page but greyed out or under a section “Hidden Accounts” which the user can expand and “Unhide” if needed. (This way they can manage them later.)
	•	We can implement the UI for this in a later polish step, but make sure the field is there and the sidebar filter respects it (i.e., when rendering sidebar, filter accounts where isHidden=false).
	•	Testing: Manually test adding an account (e.g., “Checking Account” $1000 balance). See it appear in the list and in the sidebar. Test editing the name or balance. (Note: If we store currentBalance and want it to update from transactions, editing balance might not be typical – initial balance is set once. We might decide that currentBalance is read-only calculated from initial + transactions. In that case, do not allow editing balance except via transactions. For now, we can allow adjusting it if needed for corrections.)
	•	Test hiding an account: mark one as hidden, verify it disappears from sidebar (and maybe from main list view unless viewing hidden).
	•	Test deleting an account with no transactions (should remove it). Test deleting with transactions (should be prevented or also remove those transactions depending on chosen approach).
	•	Ensure the form actions return errors for invalid input (e.g., missing name, or negative initial balance if not allowed, etc.) and that those are displayed to the user.

6. Category Management Feature

Implement the Categories section so users can manage their transaction categories:
	•	Categories Page (/categories): Create a page to list all categories belonging to the current user. Fetch categories via Prisma (filter by userId). If the app has some default categories for new users, those could be inserted on first login; otherwise, user starts with none and adds them.
	•	Display categories in a simple list or table. Columns: Name of category, and optionally Type (Income or Expense, if we distinguish) or an icon. We can also show usage stats like “Transactions: X” or “Budgeted: $Y this month”, but calculating those in real-time might be more involved. We could perform a count of TransactionParticipants for each category (for current month or total) just to show usage. To keep it simple initially, focus on listing names.
	•	Add Category: Provide a form to add a new category. Fields: name (text), and maybe a type (expense or income). Could also allow choosing an emoji or icon for the category (not essential). Use a form action createCategory to insert it. Validate that name isn’t empty and (optional) that the user doesn’t already have a category with the same name (to avoid duplicates).
	•	This can be a small form on the Categories page or a modal dialog form triggered by an “Add Category” button. Using a modal (dialog) keeps the UI consistent and avoids leaving the page.
	•	Edit Category: Allow renaming a category. Perhaps the list of categories has an edit icon on each row. Clicking opens a modal with a rename field. Or inline editing could be enabled (like clicking the name turns it into an input). Simpler is a modal or separate page. Implement an editCategory action to update the name/type.
	•	If we implement icons or color coding, allow editing those attributes too.
	•	Delete Category: Allow deletion of a category. This is tricky if the category is in use:
	•	If there are transactions or budgets associated with this category, we should prevent deletion or ask the user to reassign those records first. A common approach is to merge or replace the category rather than just deleting:
	•	You could implement a feature: when deleting, if it’s in use, either block it or prompt to merge into another category. Merging means updating all TransactionParticipants and Budgets referencing the old category to a new category, then deleting the old one.
	•	For now, a simple approach: if no transactions or budgets use the category, allow delete. If in use, either block with an error “Category in use, cannot delete,” or implement the merge flow.
	•	Merge Categories (optional advanced tool): Provide a UI where the user selects a “source” category and a “target” category, then an action that moves all transactions and budgets from source to target, then deletes the source. This can be useful if the user ends up with duplicates or wants to consolidate categories. If doing this, put it under a “Tools” section or as part of delete confirmation “Do you want to merge this category into another?”
	•	Testing: Add a few categories (e.g., Groceries, Rent, Utilities, Salary). Ensure they show up in the list. Try editing a name and see it update. If you have transactions or budgets (once those features are built), test that they still reference the correct category after renaming (they should, since we use IDs, name change doesn’t break link).
	•	Test deleting a category that is unused (it should disappear). Test deleting one that is used: ensure the app prevents it or handles it gracefully (if you implemented merge or cascade, verify that). If you haven’t built budgets or transactions yet at this step, you can simulate by temporarily adding a Transaction with that category to see what happens on delete (or just plan to test later once transactions exist).

7. Transactions: Listing and Basic CRUD

This is the core of the app – recording and viewing transactions. Implement the Transactions page to list all transactions and allow adding new ones (single-user transactions for now, we will handle shared splitting later):
	•	Transaction List Page (/transactions): Create a page that shows a table or list of transactions for the current user. In +page.server.ts, fetch the user’s transactions via Prisma. Likely, we want to include related Category and Account for each transaction (Prisma can include relations).
	•	By default, show recent transactions (e.g., the last 1-2 months or last 20 transactions). We can later add filtering controls for date range and account.
	•	Columns to display:
	•	Date – formatted nicely (e.g., Sep 5, 2025). Sort the list by date (desc, newest first or oldest first based on preference).
	•	Account – show the account name or a short identifier. This is useful if viewing all accounts together; if we later allow filtering by account, this column might be hidden in single-account view.
	•	Description (Payee/Memo) – a single column that combines the payee and memo for readability. For example, “Starbucks – Coffee with friends”. Alternatively, separate Payee and Memo columns if needed.
	•	Category – the category name for this transaction. (If the transaction is split into multiple categories for the current user, we could display “Multiple” or list the main one and indicate split – more on splitting later.)
	•	Amount – the amount of the transaction. Display with currency symbol. For expenses, you might show a minus sign or red color; for income, maybe green or plus sign. If the amount is stored as negative for expenses, you can format it absolute and prefix “-”. Or store all amounts positive and use a separate field for type.
	•	Type – we might not need a separate column if we differentiate by color or sign. But you could have a small label or icon for expense vs income (e.g., down arrow for expense, up arrow for income) or for transfers.
	•	Shared/Payer – if the transaction is a shared expense and someone else paid, it’s useful to indicate that. For example, if you are viewing your transactions and there’s one that you didn’t pay (maybe your friend paid and it’s listed because you owe part of it), mark it as such (maybe an icon of two people or a label “Shared – paid by [Name]”). For now, since we haven’t built shared logic, skip or prepare a column to fill later.
	•	Split indicator: If a transaction has multiple category splits for the user, show an icon (like 🍕 sliced, or just a symbol) to denote it’s split. We’ll implement actual splitting later, but design the column now (maybe a tiny icon next to the amount or category).
	•	Filtering Controls: Provide UI elements to filter transactions:
	•	A dropdown of accounts (“All Accounts” by default, or a specific account). Selecting an account filters the list to that account’s transactions. This can be done by adding a query parameter ?account=ID and adjusting the Prisma query in load to filter by accountId if present.
	•	A month/year selector or date range: for example, a dropdown to pick a month (Jan, Feb, etc.) and year, or two inputs for start/end date. Initially, maybe default to current month. If not selected, show all or last 3 months. Implementing full filtering UI can be iterative; one approach is to always show the current month by default and allow navigation (like “< Prev  Next >” to go month by month).
	•	The UI can show a heading like “Transactions – August 2025” when filtered by a month.
	•	These filters can be implemented via <form> that does a GET submission (so it reloads the page with query params, which works without JS) or via reactive statements if using Stores. Simpler: use the query params approach with SvelteKit’s load reading url.searchParams.
	•	Add Transaction: Provide a prominent button “Add Transaction”. Clicking it opens a dialog form (for a snappy UX) to add a new transaction:
	•	Fields: Date (default today, use <input type="date">), Amount (number, allow decimals), Account (dropdown of user’s accounts, default to a “primary” account or the one currently filtered), Category (dropdown of categories, maybe grouped by expense/income), Payee (text), Memo (text, optional).
	•	Also include a toggle or select for Type (Expense or Income). Alternatively, infer type: if the user selects an income category or enters a positive amount maybe we mark as income. Perhaps simpler: have a radio or toggle: Expense vs Income, which could control how we treat the amount (e.g., if expense, we might store it as negative internally or just mark type field).
	•	Form Action: Implement createTransaction action. This should:
	•	Parse and validate the input (ensure required fields are present, amount is a number, date is valid, etc.).
	•	Determine the transaction type: if Expense, ensure amount is stored as negative (or a flag type=expense). Decide on one approach: either store negative values for expenses or store all amounts positive and use type field to differentiate. For simplicity, let’s store expenses as negative amounts and incomes as positive, which makes summing easier for net calculations. In that case, if user marks “Expense” and enters 50, we save -50.
	•	Create a Transaction record (with payerId = current user, accountId, amount, date, payee, memo).
	•	Create a TransactionParticipant for the current user: userId = current user, categoryId = selected category, amount = (maybe the same as transaction amount if negative for expense, or could store positive and infer sign from transaction).
Alternatively, we could choose to store participants’ amounts as positive always and infer their owe/owed from context. But likely easier: if transaction amount is -50, we can store participant amount -50 for consistency. Or store +50 and use a field to indicate expense vs income. This can be decided based on how we want to sum budgets (summing negative might be fine).
	•	Since this is a personal transaction (no sharing, one participant), mark the participant as settled or not pending by default (it doesn’t really matter because pending is only for others owing money).
	•	Update account balance: If maintaining currentBalance in Account, update it (for expense, subtract, for income add). This could also be done by computing later, but if we want instant reflection in UI, updating here is handy. (Be mindful of consistency if transactions can also be imported or deleted – must also update balances accordingly.)
	•	Return a success or redirect. If we stay on the page, we might use the form’s result to update the transactions list (SvelteKit allows returning data from action which you can use via +page.svelte after form submission). Or simply invalidate() the load data to refresh the list.
	•	With JavaScript, the modal can close on success and the new transaction appears in the list without full page reload, giving a smooth experience. Without JS, the form would do a full page post, run action, then show the page with new data (still fine).
	•	Edit/Delete Transaction: In the transactions list, each row could have edit/delete buttons (perhaps visible on hover or always visible as small icons).
	•	Edit: Open a dialog similar to add, but populated with existing data. On submit, call an editTransaction action to update it. This needs to update the Transaction and potentially its participant entry (e.g., if category or amount changed). Also update account balance if amount or account was changed (that requires adjusting the old account and new account balances accordingly).
	•	For shared transactions (later), editing might be limited to the payer. But for now, all transactions belong to user so allow full edit.
	•	Delete: Clicking delete asks confirmation, then calls deleteTransaction (maybe via a small form or fetch). The action should remove the Transaction and its participants. Also update account balance (subtracting a negative expense means adding back, or vice versa). If deleting a transaction that was part of a budget or reports, those will naturally update when data is refetched.
	•	Testing: Add some transactions using the form:
	•	Try an expense (e.g., $20 on Groceries) and an income (e.g., $500 Salary). See that they appear in the list with correct sign/color and that account balances updated (if implemented).
	•	Test filtering: select a single account filter, ensure only that account’s transactions show. Try month filter if implemented.
	•	Edit a transaction’s amount or category and confirm the change reflects in the list and the account balance adjusts accordingly.
	•	Delete a transaction and confirm it’s removed and balance adjusts.
	•	Try the UX with and without JS: disable JavaScript and ensure you can still submit the add form (it will reload the page with the new transaction listed). With JS, ensure no full reload happens (the modal closes and list updates).
	•	If any validation fails (like missing field or non-number amount), ensure the form shows an error message and doesn’t proceed.

8. Budgeting Feature (Monthly Budgets by Category)

Implement the budgeting system, allowing users to plan their spending and track it against actual expenses:
	•	Budget Model Recap: We have a Budget model for category-month allocations. We’ll use that to store user’s planned budget for each category each month.
	•	Budgets Overview Page (/budgets): This page will show a list of months (and year) for which the user has budget data or transactions. It could list, say, the last 6 months and next 1-2 months (so user can plan ahead).
	•	For each month, display a summary:
	•	Month Year (e.g., “September 2025”),
	•	Total Budgeted (sum of allocatedAmount for that month across categories),
	•	Total Spent (sum of expenses in that month for the user),
	•	Remaining = Budgeted – Spent.
	•	Possibly a quick status: e.g., if Remaining is positive, show “Under Budget” in green; if negative (spent more than budget) show “Over Budget” in red; if zero, “On Budget”.
	•	This overview gives the user an idea which months they stayed under or went over. It can help navigate to detail.
	•	Each month row can be clickable to drill down.
	•	Budget Detail Page (/budgets/[year]/[month]): When a specific month is selected, show a detailed breakdown by category:
	•	List all categories that either have a budget allocation or had spending that month.
	•	For each category, display: Category name, Budgeted amount, Actual spent amount (sum of that category’s TransactionParticipants in that month), and Remaining (budget - spent).
	•	Use a visual indicator like a progress bar:
	•	For example, a bar that fills up to 100% at the budget amount. If spent is below budget, the bar is partially filled (maybe green). If spent equals budget, it’s full (maybe blue). If spent exceeds, it might overrun or simply show full bar in red with an indication of how much over (e.g., “+$15 over”).
	•	The shadcn-svelte library might have a Progress component we can style. Or use a simple <div> with Tailwind width percentages.
	•	If a category has no budget set but has spending, you could list it as “Unbudgeted” with budgeted = $0, spent = whatever. This highlights areas the user spent money without a plan.
	•	Totals: at bottom or top, show total budget vs spent for the month (which should match what was on the overview).
	•	Adding/Editing Budgets: Enable the user to set budgets for each category:
	•	There could be an “Edit” button that toggles the view into an editable mode (like each budget amount becomes an input field). Or simply put an input next to each category in the detail page so the user can change the number.
	•	Alternatively, have an “Add Category Budget” dropdown to add a new category for that month that currently isn’t budgeted.
	•	When a value is changed or a new category budget is added, handle it with a form action (updateBudget or setBudget). This action will upsert a Budget record: if one exists (identified by userId, categoryId, month, year), update the allocatedAmount; if not, create a new one.
	•	After submission, reload the data for that page (or use the returned data to update the store). If JS is on, this could be seamless (no full page reload).
	•	Validation: ensure the amount is non-negative. Possibly allow zero to effectively remove a budget (or we could have a separate delete budget action if they want to remove it – which could be simply setting it to 0 or deleting the record).
	•	Copy Previous Month: Provide a button on a future month (say October 2025) to “Copy budgets from September 2025”. This will iterate over last month’s Budget records and create equivalent ones for the new month (or only for categories the user wants).
	•	Implementation: in a form action (maybe copyBudgets with source month/yr and target month/yr), query all Budget records for source, then for each, upsert into target month. After copying, redirect or refresh the page to show the copied budgets.
	•	This feature saves time if user’s budgets don’t change much month to month.
	•	Rollover (Carryover): Optionally, if the user has leftover budget or overspent in a category, they might want to carry that over to next month. For example, if they budgeted $200 for groceries and only spent $180, they have $20 left – they might want to add that to next month’s groceries budget (making it bigger). Or if they overspent by $50, they might start $50 less next month.
	•	This can be done manually by user adjusting next month, but we can assist: at end of month, show a note like “You have $20 remaining in Groceries. [Add to next month]”. Clicking could simply increment next month’s budget by $20.
	•	Implementing could be a small form next to each category at month end (or on the detail page after the month is over) with a button “Roll over surplus/deficit to next month”. This would perform an update on next month’s Budget for that category.
	•	This is an advanced nice-to-have; can be done after core is working.
	•	Spent Calculation: To get spent per category per month, sum the TransactionParticipant amounts for that user, category, and date range within the month. If storing expenses as negative, sum of negatives will be negative; you might take absolute or invert sign for display. Alternatively, sum absolute values for expense categories and sum income categories separately. To avoid confusion, we might store all budget and spent values as positive for the magnitude of spending. For example, if $50 expense, budget 100, we say spent 50 (not -50).
	•	So in code, sum -SUM(amount) for expenses (to get positive total spent) or filter by type.
	•	Or add a condition in query: we know category type or transaction type to decide sign. Possibly simpler: ensure that when we create participants for expenses, we also store positive values but have an attribute or rely on transaction’s type.
	•	This detail needs consistency: it might be easier to treat all amounts as positive in budgets context, using the knowledge of expense vs income. For now, assume expense categories => we use absolute of negative transaction amounts.
	•	Integration with Transactions: When a new transaction is added, if it falls in the current month, it should immediately reflect in the budget spent values. This can be achieved by recalculating on page load. If the user is looking at the budget page and adds a transaction in another tab, they’d have to refresh to see updated spent. Real-time updating is not required initially.
	•	Testing:
	•	Set a budget for a couple of categories for the current month. E.g., Groceries $300, Rent $1000.
	•	Add transactions in those categories (Groceries $50, Rent $1000) via the Transactions page.
	•	Check the Budget page: it should show Groceries: Budget 300, Spent 50, Remaining 250; Rent: Budget 1000, Spent 1000, Remaining 0.
	•	Try overspending: add another Rent $200 transaction. Now spent 1200 on budget 1000, remaining -200 (over budget). The UI should reflect over-budget clearly (maybe in red, and perhaps show “Over by $200”).
	•	Try the copy last month feature: after setting up one month, click copy for the next. Verify new Budget records created.
	•	Try adjusting a budget mid-month: e.g., increase Groceries to $350 if you see you’re trending high. Edit it and see it update.
	•	Ensure that if a category has no budget but some spending, it appears on the detail page as unbudgeted (or at least not missing).
	•	Test rollover (if implemented): overspend or underspend, click rollover, and see next month’s value adjust.
	•	The budgets feature involves a lot of calculations; double-check edge cases like leap year February (short month doesn’t really matter except date range calculations), or multiple incomes in a category (like a salary category could have budget for income? Most budgets are for expenses, but some people budget income too or saving goals – perhaps treat income categories separately or just allow it with same logic).

9. Shared Expenses: Data Model & Pending Shares Page

Extend the app to support shared expenses between users. This builds on the TransactionParticipant model to handle multiple users per transaction:
	•	Data Model for Sharing: We already have:
	•	Transaction.payerId to denote who paid the whole amount.
	•	TransactionParticipant entries to split the amount among users.
	•	For a personal transaction, we had one participant (same user as payer). For a shared transaction:
	•	The payer will have potentially a participant entry if they are also sharing the cost, and each other person involved will have a participant entry.
	•	Example: Alice pays $100 for dinner with Bob and Charlie. Transaction: amount 100, payerId=Alice, account=Alice’s credit card. Participants:
	•	Alice: amount $30 (her share, category Dining Out),
	•	Bob: amount $30 (his share, category Dining Out),
	•	Charlie: amount $40 (his share, category Dining Out).
The sum = $100. Alice’s account is charged $100 (the transaction amount). Bob and Charlie each owe Alice their amounts.
Their participant entries would be marked PENDING (meaning they have not settled this debt). Alice’s own participant could either be implicitly settled or just not marked pending because she doesn’t owe herself.
	•	The status field in TransactionParticipant indicates if the share is settled or not. When Bob pays Alice back, we’ll mark Bob’s participant as settled (and link to a Settlement).
	•	Creating a Shared Transaction: Modify the “Add Transaction” form to allow adding participants (other users) and splitting the total:
	•	Perhaps add a toggle or button “Split with others” on the add transaction dialog. When activated, the form shows fields to add multiple participants:
	•	One row per person: could be an input for an email/username (to identify the other user) and an amount or percentage. Or simpler, evenly split initially and allow editing amounts.
	•	The form could auto-include the current user (payer) as one participant by default.
	•	Example UI: If the user enters total $100 and chooses to split with 2 others, the form can create 3 rows (for payer and 2 friends) defaulting to $33.33 each if equal split. The user can adjust each amount (ensuring the total sums to 100).
	•	Provide a way to search or select other users by email or name. Since all users sign in via Google, you might need a way to find a user by email (maybe a simple text input that expects the exact email of the friend – a bit clunky but workable for now). A nicer approach is a friend list or contact list, but that’s out of scope. So assume the user will type the email of the person to share with (that person must also have an account in the app).
	•	Validate that the sum of participant amounts equals the total amount before allowing submission. (If the user uses the equal split button, it should already be correct. If they edit, add logic to enforce or at least warn if not balanced.)
	•	In the createTransaction action, handle shared case:
	•	If participants data is provided (and contains more than one person or someone other than current user), treat it as a shared expense.
	•	Create the Transaction as before (with total amount and payerId = current user).
	•	For each participant entry provided:
	•	Look up the user by email (or user ID if the form somehow passes an ID). If the email doesn’t match an existing user, you have a dilemma: ideally we only share with existing users. (You could invite new users via email invite, but that’s a whole feature on its own. For now, assume both parties use the app.)
	•	Create a TransactionParticipant for each:
	•	userId = that user’s ID, categoryId = category they’ll categorize this expense under. We might just use the same category for all participants by default, or allow the payer to set category for everyone (less ideal, each might categorize differently).
	•	amount = that person’s share (for the payer it might be their portion they consider their expense, for others it’s what they owe).
	•	status: for the payer’s own participant, we can mark it as SETTLED or just not mark (maybe leave status null or use an enum where “NONE” for the payer’s own share, since they don’t owe money). For other participants (not payer), mark PENDING – they owe money to the payer.
	•	You might also set a default category for others as the one the payer chose, but later on, those other users might want to change the category on their side (we will allow editing that on their view).
	•	The account’s balance (payer’s account) is reduced by the full amount (as the transaction amount). Other users’ accounts are not touched at this time because they haven’t paid anything yet – they just incur a liability to the payer.
	•	After creating, the current user (payer) should see the transaction in their list (with a special indicator that it’s shared and maybe that others owe them). The other participants (when they log in) should also now have a record in their transactions list or in a “shared expenses” list indicating they owe this money.
	•	We must decide if non-payers see the transaction in their main list. They technically didn’t make the transaction (their account wasn’t used), but they have a liability. It might be confusing to show in the normal transactions list because it’s not an expense they paid, but it is an expense they incurred (just not paid yet). Perhaps better: do not show in regular transactions list (since that list might be more for actual account movements). Instead, list these in a Shared Expenses page or section. Many apps like Splitwise separate “balances” from actual transactions.
	•	We’ll implement a separate Shared page to list pending expenses, which is what this step is about.
	•	Shared Expenses Page (/shared or /shared/pending): Create a page to show all outstanding shared expense items for the current user.
	•	This page can have two sections or tabs: “You Owe” and “You Are Owed”:
	•	You Owe: List all TransactionParticipant records where userId = currentUser and status = PENDING and where the payer is someone else (i.e., transactions not paid by current user). These are things the current user needs to pay back.
	•	You Are Owed: List all TransactionParticipant records where status = PENDING and the current user is the payer (i.e., Transaction.payerId = currentUser but participant userId is someone else). These are amounts others owe to the user.
	•	Each entry should include info: date of the original transaction, description (payee/memo), total amount (maybe the full transaction amount or just the participant’s amount? Better to focus on the participant’s amount since that’s what’s owed), the other party’s name, and maybe the category (for the current user’s view, show how they categorize it).
	•	For “You Owe” entries, show something like: “$40 to Alice for Dinner on Sep 1” (with maybe Dinner as category).
	•	For “You Are Owed”, show “$40 from Bob for Dinner on Sep 1”.
	•	Including the total transaction amount can be informational e.g., “(Total $100, split 3 ways)” if needed.
	•	Provide actions on these entries:
	•	For items in “You Owe”: the user can mark them as paid (we will implement settlement in the next step, which covers multiple at once; for now, perhaps they can select several and click “Settle”).
	•	The user can also adjust the category of these items. E.g., if Alice paid a dinner and split with Bob (you owe $40), Bob might want to categorize that $40 as “Dining” in his own records. So allow editing category and memo for your own participant entry. This could be done inline (like a pencil icon that lets you pick a category, then save via an action updateParticipant).
	•	Calculating totals: At the top of the Shared page, display summary totals: “Total you owe: $X” (sum of “You Owe” items) and “Total you are owed: $Y” (sum of “You Are Owed”). This gives a quick sense of overall balance. If the user is net positive or negative, they might want to settle up accordingly.
	•	Notifications: If user A adds a shared expense with user B, ideally user B would get notified. Implementing real notifications is beyond scope, but we might consider sending an email or just rely on the fact that when B logs in they’ll see it. For now, skip notifications.
	•	Testing:
	•	Simulate with two user accounts (if possible, in dev, maybe create two browser sessions). As Alice, add a transaction and split with Bob’s email. Check DB: Transaction created, participants for Alice and Bob created, Bob’s participant status PENDING.
	•	Log in as Bob (or inspect via DB/console) to see that Bob has an entry. The Shared page for Bob (You Owe) should list that item, amount $X owed to Alice. The Shared page for Alice (You Are Owed) should list $X from Bob.
	•	Check that sums are correct if multiple items.
	•	Edit a category on Bob’s side and ensure it updates just Bob’s participant category, not affecting Alice.
	•	Verify that these pending items are not counted in budgets or normal transactions list for Bob (since he didn’t actually pay them yet, should they count as his spending? Typically not until he pays, because budgets usually reflect money outflow. So likely we exclude PENDING shares from Bob’s expense totals. Alice, however, did pay out the full $100, which her budgets and accounts reflect. Bob will only reflect it when he settles by paying).
	•	So ensure in budget calculations or net worth, Bob’s pending is not counted as spent. This might mean filtering out pending participants for non-payers in those calculations.
	•	Likewise, Alice’s account balance went down by $100 (full amount). The fact Bob owes her $40 is like a receivable – it doesn’t automatically put money back in her account. It’s just recorded separately. So net worth wise, maybe she still lost $100 cash, but she has an IOU of $40 (which is not a cash asset, but a receivable). If we wanted, we could reflect receivables in net worth, but let’s keep it simple for now or perhaps mention it in dashboard as separate line.
	•	Ensure the workflow for adding shared expense and viewing pending works smoothly.

10. Settlement of Shared Debts

Implement the flow for users to settle up shared expenses (record payments that clear pending IOUs):
	•	Select Items to Settle: On the Shared page (especially the “You Owe” tab), allow the user to select one or multiple pending items to pay off. For example, checkboxes next to each “You owe” entry or a “Select all” if they want to pay a person in one go.
	•	We should restrict that the selected items all have the same counterparty (it’s typical to settle with one person at a time). If the user selects items involving different people, either disable that or handle separately (maybe separate settlements).
	•	The UI could group the list by person: e.g., under “Alice” list all items you owe to Alice, under “Charlie” items for Charlie, etc., with a subtotal per person. Then you could click “Settle with Alice” and it automatically picks all items for Alice.
	•	For simplicity, we can implement selection freely but then if multiple counterparties are selected, show an error or only process one counterparty at a time.
	•	Settle Form: When the user clicks “Settle” after selecting items, open a dialog to record the settlement:
	•	Show the total amount to be paid (sum of the selected IOUs).
	•	Show the counterparty name (e.g., “Settle up with Alice for $X”).
	•	Fields: Date (default today), From Account (which account the current user is using to pay – e.g., Cash or Bank; only show accounts of current user, likely a bank account or cash), Payment Method/Note (a text note, e.g., “Paid via e-transfer” or check number).
	•	If the user is settling an amount someone owes them (i.e. “You Are Owed” items), the form might be slightly different: To Account (account where you received money, perhaps your bank), note, etc. We might have two variants:
	•	If user is paying (settling debts they owe), then fromUser = current user, toUser = other person.
	•	If user is receiving (settling debts others owed to them), then fromUser = other person, toUser = current user. But since the other person isn’t actively doing it in our system, the current user is just recording it.
	•	We can unify it: always treat it as current user initiating. So if current user is owed money and they got paid, they will still create a settlement record (with roles appropriately set).
	•	Form Action (settleExpenses): On submit, perform the settlement:
	•	Determine the set of participant IDs or transaction IDs that were selected (the form can include hidden inputs for each selected item’s id).
	•	Fetch those participants from DB, ensure they all belong to current user either as payer or payee (to avoid tampering).
	•	Compute total (for verification and in case the form total was manipulated).
	•	Determine the other user: likely all selected shares have the same Transaction.payerId (if current user owes) or the same userId (if current user is payer and others owe them). Identify that person as the counterparty.
	•	Create a new Settlement record:
	•	fromUserId = current user if they are paying, or current user if they are receiving? Actually, if current user is paying Alice, then fromUser=current user, toUser=Alice. If current user is marking that Bob paid them, then fromUser=Bob, toUser=current user.
	•	So logic: if all selected participants have userId = currentUser (meaning these are things current user owes, so someone else paid originally), then current user is the one paying now -> fromUser = currentUser, toUser = that other person (the original payer of those expenses).
	•	If participants have different original payers, that’s an error (shouldn’t select across payers).
	•	If all selected have Transaction.payerId = currentUser (meaning current user was original payer and is now receiving money), then someone else is paying now -> fromUser = that other person, toUser = current user.
	•	If multiple debtors selected at once (like Bob and Charlie combined)? We should avoid that; ideally only one person’s debts selected.
	•	Update Participants: For each selected TransactionParticipant, set status = SETTLED and set settlementId = (new Settlement’s id).
	•	Account Updates: If current user paid money:
	•	Decrease the chosen “from account” balance by the total amount (because money left their account).
	•	Optionally, increase the other user’s account? But we likely do not have access to the other user’s data at this moment (and they might not explicitly track receiving money; the original expense being settled is enough). Probably we do not adjust the other user’s account because they likely already accounted for the expense when they paid it.
	•	If current user is paying via an account, we might also create a Transaction record for the payment itself (like a transfer or a special transaction type “Settlement Payment” for record-keeping in their account). This could be useful so their account ledger has that outflow recorded. But it might be overkill to double-record (since the expense was already recorded on original payer’s side).
	•	If current user is receiving money:
	•	Increase the chosen “to account” balance by the amount (money received).
	•	Similarly, optionally record a transaction for income “Settlement received” in that account.
	•	These account adjustments ensure the accounts reflect the actual cash movement from the settlement.
	•	Implementation detail: It might be easier to record settlement as a distinct concept and not mix with the normal transactions ledger, to avoid confusion, but accounts balances should reflect reality. Perhaps mark the settlement transactions in a special way if created (so they don’t double count in budgets etc., since they are transfers between users).
	•	Alternatively, skip creating explicit transactions for settlement payments; the original expense was recorded and the rest is just clearing debt. However, the account balance of the payer who is paying now would not change in our system unless we log it. So better log it: e.g. a Transaction of type “TRANSFER_OUT” for the payer’s account, and “TRANSFER_IN” for receiver’s account, both linked to the settlement (or skip if too complex).
	•	Once done, commit all these changes in a transaction (to ensure consistency).
	•	Possibly send a notification or email to the other user that a payment was made (out of scope, but could consider).
	•	After settlement, those participant entries will no longer show in pending lists. The Settlement record can be viewed in the Settlements history page.
	•	Partial Settlements: The requirement hints at “partial & full settlement, auto-match, exact-match only”. For simplicity, our approach is exact-match: the settlement covers specific whole items. Partial payment of one item (like paying $20 out of a $50 IOU) is not directly supported by our model (we’d have to split that participant entry or allow it to remain partially pending). We won’t implement partial in initial version – user should settle each expense fully. If needed, they could break an expense into smaller ones manually.
	•	Auto-match: If the user enters an amount that doesn’t exactly equal the sum of selected IOUs, we might attempt to match a combination. But since we’re selecting specific items, we already have a sum. We’ll enforce that they pay the exact sum of selected items (or allow them to deselect if they want to pay fewer).
	•	A possible convenience: if they want to pay a round amount that covers multiple items and maybe some remainder, we could allow selecting more items than amount covers – but that’s confusing. Better keep it exact.
	•	Testing:
	•	Scenario: Alice paid two expenses that Bob owes ($30 and $50). Bob logs in, sees two items “You owe Alice $30 and $50”. Bob selects both and chooses to settle $80 via his bank account.
	•	After settlement, check:
	•	A Settlement record exists: fromUser=Bob, toUser=Alice, amount=80.
	•	Those two TransactionParticipants for Bob are now status SETTLED with settlementId set.
	•	Bob’s bank account balance decreased by 80 (and perhaps a “Settlement payment” transaction exists in Bob’s account if we chose to create one).
	•	On Alice’s side, those items should disappear from “You Are Owed”. Alice’s accounts might not automatically change (since she initially paid $80 total and that was an expense recorded; now she got $80 back – ideally her cash account goes up $80 if she recorded receiving it).
	•	If we created a transaction for Alice receiving, her account would increase by 80 and her overall expense gets offset (which makes sense – effectively she only paid the difference if any).
	•	If we didn’t create a transaction for receipt, then her account remains showing a $-80 outflow that got “settled” off-record. That would understate her actual money because she actually got paid back. So better to record it.
	•	Possibly we should indeed create a transaction for Alice: maybe credit her “Inbox/settlements” account or one of her accounts. But since we asked Bob (payer) only for his account, maybe also ask Alice’s account to credit? However, since Alice might have many accounts, perhaps assume the money goes to Alice’s default cash/bank account. Or let Alice later adjust.
	•	A simpler approach: when Bob settles, we could automatically credit Alice’s same account that was used for the original expense (like her credit card or bank). But if original was a credit card, paying her back doesn’t directly affect the credit card balance, it would be that she now has extra cash to pay it. This is tricky to model perfectly without double accounting.
	•	Perhaps for now, don’t auto-update Alice’s account. Alice can see in the Settlements page that Bob paid her $80, and she can manually adjust her finances (or we assume it’s reflected outside of app).
	•	Or, prompt in settlement form for which account Alice received money into (if current user is Alice receiving, she would do this process, but if Bob is doing the paying, he wouldn’t know).
	•	So maybe only if current user is recording a payment they received, we ask for an account to deposit. That case is “You Are Owed” tab.
	•	Also test the reverse: Alice is owed by Bob and Charlie, and Alice wants to mark that Charlie gave her cash. Alice goes to “You Are Owed”, selects Charlie’s item, and records settlement (fromUser=Charlie, toUser=Alice, account receiving = Alice’s cash). That should mark Charlie’s participant settled and increase Alice’s cash account.
	•	Test that settled items no longer appear in pending lists, but show up in Settled tab or history (to be built next).
	•	Ensure that after settlement, the budgets and transactions for each person remain correct:
	•	For Bob, when he pays $80 to Alice, should Bob count that as an expense in his budget now? Probably yes – when Bob pays back, that is an expense (money out for him). If we created a transaction for Bob’s account, then it will appear in Bob’s transactions and budget (like a transfer or maybe categorize it under whatever category the original was or a generic “Settlements” category).
	•	If we want Bob’s spending to reflect dinner $80, maybe better approach: when the expense was initially created, Bob’s budget did not count it (because he hadn’t paid). Once he settles, we could optionally add those expenses to his budget. But we’re not splitting original expense into Bob’s budget because he didn’t pay initially. Instead, the act of paying back is effectively him spending on the category of those expenses.
	•	A nice approach: when Bob pays, create a Transaction for Bob (account and category same as original) of $80. That way Bob’s expense tracking now counts that dinner under Dining category. This would double count overall in system, but from perspective of personal budgets, each person’s own spending is tracked.
	•	However, double count in aggregate: Alice had an expense $80, Bob now also has expense $80. But Alice got reimbursed, which we didn’t log as negative expense for her. If we don’t log reimbursements, Alice’s net expense is overstated (unless she manually offset it).
	•	This is complex; perhaps out of scope to perfect accounting. Simpler: track everything from each person’s perspective:
	•	Alice records full expense at time of spending.
	•	Bob doesn’t record expense until he pays.
	•	When Bob pays, we create a transaction for Bob’s ledger (Dining $80), and optionally create a transaction for Alice’s ledger for reimbursement $80 (which could be income category or negative expense to offset).
	•	That balances it: Alice’s net expense on that dinner becomes $0 (paid $80, got $80 back), Bob’s expense is $80.
	•	The Settlement record links them conceptually.
	•	This is possibly too detailed to implement fully now, but at least we should mention it as a consideration. For now, maybe skip adding separate transactions to avoid confusion, and trust the user’s ability to interpret “you were paid back”.
	•	In summary, the settlement feature ensures all pending debts can be cleared and recorded properly in the app.

11. Settlements Page and Statements

Create a page to review all settlements (payments) made or received, and provide details for transparency:
	•	Settlements History Page (/settlements): List all Settlement records involving the current user (either as payer or receiver):
	•	Columns: Date, From → To (parties involved), Amount, Account (the account from which the money was paid or into which it was received), Note.
	•	Format the parties column in a human-friendly way from current user’s perspective:
	•	If fromUserId == currentUser.id, then it’s “You paid [OtherName]”.
	•	If toUserId == currentUser.id, then “[OtherName] paid you”.
	•	If current user is both from and to (should not happen), skip.
	•	The amount column can be just the amount (positive always, since direction is indicated by context).
	•	Account: show the account name (for payments you made, which account you used; for payments you received, which account you deposited into). This was captured in Settlement.accountId.
	•	Note: the memo like “via PayPal”.
	•	Optionally, you might include a column or icon for Method if you had specific methods.
	•	Sort by date, newest first.
	•	Settlement Details: The user might want to see which expenses were settled by a given payment. We can implement an expandable row or a detail page:
	•	For each settlement, we can list the transactions or participants that it covered. Since each TransactionParticipant has a settlementId, we can query all participants with that id. Those have info on original transactions.
	•	Could show a sub-list: e.g., for settlement on Sep 5 where Bob paid Alice $80, show “Covered: Dinner $30 (Aug 1), Movie tickets $50 (Aug 10)” – the descriptions of the original transactions and amounts.
	•	This helps for recordkeeping and any disputes (“what did I pay you for?”).
	•	Implementation: In the settlements list, each row could be clickable or have a drop-down arrow. On click, load the participants for that settlement (maybe we already prefetched via Prisma include) and display a small list under the row.
	•	Alternatively, create a separate page /settlements/[id] if more appropriate. That page can show the two parties, amount, date, note, and then list each expense (with links to the original transaction perhaps).
	•	Export Settlements: Provide a “Download CSV” or “Export” button. This could generate a CSV file of all settlements or perhaps a filtered range. It might include all columns. This is a nice-to-have for users who want to keep records outside the app.
	•	Implementation: Create an endpoint or action that queries all settlements for user and formats CSV (e.g., using PapaParse or manually).
	•	Allow filtering by date range in the UI (like a from/to filter) before exporting, if desired.
	•	Integration with UI: Add a link in the sidebar nav to Settlements (if not already). Or combine Shared and Settlements under one section with tabs (like a combined page or in nav one under the other).
	•	Could do: “Shared Expenses” and a sub-link “Settlements History”.
	•	Testing:
	•	After performing a few settlements in the previous step, go to the Settlements page. Verify that each settlement is listed correctly (“You paid X” or “Y paid you”) with correct amounts and dates.
	•	Expand a settlement to see the details of what was settled. Cross-check that those correspond to the earlier pending items.
	•	Test exporting: download the CSV, open it to ensure formatting is correct (e.g., proper escaping of any commas in notes, etc.).
	•	Try filtering by date if implemented (e.g., show only this year’s settlements).
	•	Also test with both roles: make sure both ones you paid and ones you received are present.
	•	If any data mismatch or missing info (like maybe we didn’t store which account the other person used if you’re the receiver – since settlement.accountId is only one field, presumably the payer’s account or the one the current user used. If current user was receiver, we stored accountId as where they put money.)
	•	Make sure that logic is consistent: e.g., if current user was the receiver and she chose her account in settlement, accountId is her account. If current user was payer and chose his account, accountId is his. So the account displayed should always belong to current user for their own reference (which it will, since we always asked the current user for their account either paying or receiving).
	•	Verify that settled transactions (participants) no longer appear in the Shared Pending page, and perhaps optionally have moved to a “Settled” tab if we have one.
	•	We could implement a “Settled” tab on the Shared page listing recently settled items for reference. But since we have a whole Settlements page, that might suffice.

12. Importing Transactions and Data Tools

Implement functionality to bulk import transactions from external files (like CSV or OFX bank statements), as well as some data management tools:
	•	Import Page (/import or /tools/import): Create a page for data import. This will allow the user to upload a file of transactions exported from their bank or another app.
	•	Provide an <input type="file"> that accepts CSV (and maybe .ofx). When a file is selected and form submitted (to a form action importData), the file will be available in the action via event.request.formData().
	•	File parsing: In the action, read the file. For CSV, you can use Node’s built-in parsing (treat as text and split by lines/commas) or a library like Papa Parse (papaparse can parse CSV in Node). For OFX (which is an XML format), you might use a package or parse the XML (there are OFX parsers on npm).
	•	Because implementing a robust parser is complex, you might restrict initial support to CSV which is more common and easier.
	•	Assume a common CSV format: e.g., columns like Date, Description, Amount, maybe Category. But every bank differs, so we should allow mapping.
	•	Preview and Mapping: After uploading and parsing the file, we shouldn’t directly import blindly. Instead, show a preview of a few transactions and ask the user to map columns:
	•	E.g., if the CSV first line has headers, detect them. Show dropdowns to assign each required field in our system: Date, Amount, Description/Payee, maybe a Credit/Debit separate or single Amount (some statements have positive for credits, negative for debits, others have separate columns).
	•	If no header, perhaps ask user to identify by position (less friendly, but possible).
	•	If using OFX, the format is known (contains tags like <TRNAMT>, <DTPOSTED>, <NAME> etc.), so you could parse into a fixed structure and skip mapping.
	•	Once mapping is set (user selects which CSV column corresponds to which field), allow them to confirm to proceed.
	•	Optionally, allow setting a default Account for all these transactions (the user should specify which account this statement is for, e.g., “Chase Checking”).
	•	Perhaps if they navigated from an Account detail page with import, we know the account. Otherwise, include an Account dropdown in the form.
	•	Auto-categorization (Payee Rules): After reading each transaction’s description, attempt to assign a category:
	•	Use the PayeeRule table. For each transaction, for each rule of the user, if the description (payee) contains or matches the rule’s pattern, assign that category id to the transaction. For example, rule “Starbucks” -> Category Coffee. If the description is “STARBUCKS 1234”, it matches and we set category Coffee.
	•	Keep track of which ones were matched and which were not.
	•	For those that are unmatched, we might leave category blank or default to “Uncategorized”.
	•	On the preview UI, highlight or label those with assigned categories, and the ones without category could have a dropdown for user to pick.
	•	Additionally, for each unique new payee in the import, consider giving an option “Remember to categorize this in future?” which if checked will create a new PayeeRule for that text to the chosen category.
	•	Splitting during Import: It’s possible a single bank transaction actually needs splitting in our budgeting (like a single credit card charge that includes groceries and pharmacy, for example). This is advanced for import, but we could allow the user to split entries in the preview:
	•	Perhaps next to a transaction in the preview, a “Split” button that opens a mini dialog to break one line into two with specified amounts and categories (ensuring the sum matches original).
	•	The effect would be that instead of one Transaction with one participant, we will create one Transaction with two participants for that one line (with payer as user). Or we might represent it as two separate transactions if we prefer not to use split logic – but better to use our split model.
	•	This is an edge case feature; if time is short, user can always import as one and later edit/split the transaction in the app.
	•	Executing Import: Once the user confirms the mapping and categories, the importData action will iterate through each parsed line (or each prepared transaction from preview):
	•	For each, create a Transaction (with the chosen account, date, amount, payee, memo perhaps set to description).
	•	If the amount is in two columns (credit/debit), unify them into one signed amount.
	•	Assign category: if one category, create one TransactionParticipant for that category.
	•	If the user split any lines, handle accordingly: create one Transaction with multiple TransactionParticipants.
	•	Use a transaction/batch in Prisma to insert all these. If it’s a large file (hundreds of lines), consider chunking or increasing any timeouts. Usually, prisma.transaction can handle batch inserts.
	•	Skip duplicates: We might want to avoid importing the same transaction twice. If the file overlaps with what’s already in DB, we could check by some unique key (like same accountId, date, amount, payee). However, banks often have repeating descriptions (like monthly rent same amount each month) which aren’t duplicates. So a naive check could be wrong. Some formats have a unique transaction ID or FITID (OFX has <FITID>). If available, we could store those in a new field on Transaction and use it to prevent dupes.
	•	Since robust de-duplication is hard, maybe just trust user not to import overlapping ranges, or if they do, they might end up with duplicates which they can delete manually. We can caution: “Make sure you don’t import the same file twice.”
	•	Feedback: After import, show a summary: “Imported 50 transactions into account XYZ. 5 new payee rules created.” Or list a few key stats.
	•	Also update account balances if not automatically done via transactions (we likely do update as we insert transactions, or we recalc).
	•	Other Tools:
	•	Provide a link to “Manage Payee Rules” where the user can see all their auto-categorization rules and edit or delete them. This could be a simple page listing pattern -> category, with options to remove or add new.
	•	Also possibly a “Data Export” feature: allow user to download all their transactions as CSV for backup. This could be a simple button that streams a CSV of their transactions (or one per account).
	•	If implementing export, consider including budgets or other data if needed.
	•	Testing:
	•	Prepare a small CSV file manually to simulate a bank statement:

Date,Description,Amount
2025-09-01,Starbucks,-5.50
2025-09-02,Salary,2000.00
2025-09-02,Grocery Store,-123.45

Save and attempt to import for an account.

	•	Ensure the mapping step shows and allows correct mapping (the file has headers matching Date, Description, Amount which is easy; also test if no header).
	•	Assign categories in preview (maybe have a rule for Starbucks -> Coffee ready, and see it auto assign; for others choose from dropdown in UI).
	•	Import and then check Transactions page: those transactions should appear with correct dates, amounts (with correct sign: Starbucks and Grocery negative, Salary positive), and categories set as chosen.
	•	Check that account balance updated (initial + incomes - expenses).
	•	Test a second import of the same data and see how you handle duplicates (if none, you’ll see duplicates in list).
	•	Try an OFX file if possible: might require additional parsing logic. If not implementing OFX due to complexity, ensure to note that it can be added similarly.
	•	Test splitting during preview: e.g., a line “Walmart - $150” which user wants to split into $100 groceries, $50 electronics. Use the UI to split and import, verify one transaction created with two participants with those categories.
	•	Test Payee rules management if built: add a rule and then import a transaction that matches to see auto assignment.

13. Splitting Transactions into Multiple Categories

Allow users to split a single transaction into multiple categories (for personal budgeting purposes). This is useful if one payment covers items from different budget categories:
	•	When to Split: On the Transaction creation form and edit form, include an option to split. For a new transaction, the user could click “Split into categories” if, say, they went to Costco and bought groceries and electronics under one card charge.
	•	Split UI:
	•	If the user clicks “Split”, instead of one Category and Amount field, show multiple lines for categories:
	•	Perhaps start with 2 lines by default. Each line has a Category dropdown and an Amount input.
	•	Also adjust the main Amount field either to become read-only total or hide it in favor of sum of splits. One approach: user enters the total amount at top, and then divides among splits (ensuring sum matches). Or user fills splits and we calculate total.
	•	Could do it like: keep a Total field that’s calculated = sum of split lines (if user edits splits, update total; if they edit total, maybe reallocate or require even split? That gets tricky, maybe disable editing total once splitting).
	•	Simpler: require user to allocate exactly and show a running difference or error if not matching.
	•	Provide an “Add another category” button to add more lines, and the ability to remove a line.
	•	The UI should ensure all lines have categories (maybe default the first line to what was selected before splitting, to not lose that, and amount initially equal total, then user can adjust).
	•	If JS is on, we can dynamically enforce the sum. If JS off, then server will have to validate.
	•	Form Handling:
	•	For createTransaction action: detect if the form data contains multiple category entries (e.g., the form could name them like category[0], amount[0], category[1], amount[1], etc., which come as arrays or numbered fields).
	•	If splits are present:
	•	Sum up the provided split amounts. It should equal the total amount field (or one of the amounts could be computed as the remainder of total minus others if user didn’t get it exact).
	•	If not equal, return an error message telling user to adjust.
	•	Create the Transaction with total amount as before.
	•	Create multiple TransactionParticipant records, one for each split line:
	•	Each with userId = current user, categoryId = the chosen category, amount = the respective amount (taking care of sign if we use negative for expense, etc. Possibly easier: if transaction amount is -100, the splits should sum to -100, e.g., -60 and -40).
	•	All these participants have the same transactionId.
	•	This effectively “splits” the transaction into two budget categories for reporting.
	•	As a result, the Transaction list page will still show one transaction of $100 (with maybe category as “Multiple” or just blank because multiple). We should indicate it’s split.
	•	The budgets will count $60 to groceries, $40 to electronics, etc., via participants.
	•	For editTransaction: If a transaction currently has one participant and user wants to split it, we have to delete or update that into multiple.
	•	The UI on edit could allow adding splits if not already split. If already split, show the multiple lines which they can modify (add/remove).
	•	The action should handle adjusting participants: maybe simplest is to delete existing participants for that transaction and then insert new ones as per the new splits (since recalculating differences might be too much, just replace).
	•	This means losing original category assignment if splitting after the fact, but that’s expected.
	•	Update account balance only if total changed or account changed (splitting doesn’t change total).
	•	UI Indication:
	•	In the Transactions list, if a transaction has more than one participant for the current user, mark it with an icon or a label “(split)”. Perhaps show the category column as “Multiple” or “Mixed”.
	•	We could allow expanding that row to see the breakdown. A simple way: on click of the row (or an expand icon), display the list of categories and amounts underneath as a sub-row. Or show it in a tooltip or modal.
	•	Alternatively, don’t clutter list; user can see breakdown by clicking edit or detail.
	•	Edge Cases:
	•	Splitting income transactions: Could be possible (e.g., a paycheck that covers salary and bonus categories in budgeting). So splitting isn’t just for expenses. Our model can handle it (two participants both for same user and type income).
	•	Transfers (if we had them as transactions between accounts) – usually not split, skip that scenario.
	•	Shared transactions: If a transaction is shared, each participant (user) might want to split their share into categories on their side. Our model supports each participant having its own category, but just one per participant. What if Bob’s $40 dinner share should be $20 Dining, $20 Drinks in his budget? He can’t currently split his one participant unless we allowed multiple participants per user per transaction – which essentially means Bob would have two participant records for the same transaction (both with userId=Bob, different categories summing to $40). That is actually possible if we remove the uniqueness of userId in participants.
	•	We didn’t explicitly forbid multiple per same user; it’s plausible. It complicates identifying what Bob owes (but sum still covers it).
	•	For now, likely out of scope to allow splitting one person’s share across categories in a shared expense, but it’s something power-users might want. We can mention that as a potential future improvement, using the same splitting mechanism but tied to participant.
	•	But if Bob wants to split that $40 in his budgets, one workaround is to just categorize the whole $40 to one category that best fits or the majority. Or we allow adding more participants for Bob (with same user) through the editing interface but that’s advanced.
	•	We’ll not implement splitting a share in UI now. Just note that the current design allows only one category per user per shared transaction.
	•	Testing:
	•	Add a transaction of $100 and split into two categories, say $30 Grocery, $70 Electronics.
	•	Check database: one Transaction entry (amount 100 or -100 if expense), two TransactionParticipant entries (amounts 30 and 70, categories different, user same).
	•	The Transactions page should show one entry $100, marked as split. Possibly display either “Groceries, Electronics” in the category column (you could join the names for display, if space permits).
	•	The Budgets page for that month should count $30 under Groceries spent, $70 under Electronics.
	•	Edit that transaction: try removing one category or changing amounts. Ensure sum constraint works.
	•	Try adding a third split and ensure total recalculates.
	•	Try splitting an income similarly.
	•	Ensure that account balances and net worth calculations still only count the total once (they should, since only one transaction with amount 100 affects account).
	•	Confirm that if a transaction is split and then user adds it to shared (if we allowed that scenario), things remain consistent. Actually splitting a shared transaction gets very complicated (each user splitting their share), so likely we won’t mix those in UI.

14. Scheduled Transactions & Reminders

Add support for scheduled recurring transactions, such as bills or savings deposits, and reminders for them:
	•	ScheduledTransaction Model: If not added yet, define a model (or just use a subset of data):
	•	Fields: id, userId, description (e.g. “Rent”), amount, accountId (which account it will affect when executed), categoryId (optional, maybe the category it will use when logging it), frequency (string or enum: DAILY, WEEKLY, BIWEEKLY, MONTHLY, YEARLY, or even a cron expression or interval), nextDate (Date – the next due date), endDate or occurrences (optional, if the recurrence ends).
	•	Also a boolean autoAdd (if true, automatically create the transaction on due date without user action) or reminderOnly vs auto modes.
	•	We might include lastDate or track last occurrence added.
	•	Add this to Prisma and migrate if not already.
	•	Scheduled Page (/scheduled or incorporate in Dashboard):
	•	Create a page listing upcoming scheduled transactions for the current user. Alternatively, this can be part of Settings or Tools or on the Dashboard as a widget. Possibly both: a full page for managing and also a dashboard section for imminent ones.
	•	For each scheduled item, show: Description, Amount, Next Due Date, Frequency, Account. If the date is approaching or past, highlight it (e.g., red if overdue).
	•	If an item is overdue (today >= nextDate but not marked done), we can present a button “Mark as paid” or “Add now”.
	•	If an item is auto-add and overdue, maybe it already got added (depending on implementation).
	•	Creating Scheduled Transactions:
	•	Provide a form to add a new scheduled transaction. Fields:
	•	Description (name of the recurring expense/income),
	•	Amount,
	•	Account (the account that will be affected when it happens),
	•	Category (for when it will be logged),
	•	Start Date (the first occurrence date),
	•	Frequency (could be a select: daily, weekly, monthly, custom).
	•	End criteria (maybe optional: end date or number of occurrences, or leave blank for indefinite).
	•	Reminder lead time (if we want to notify a few days before; optional).
	•	Auto-add toggle (if enabled, we will automatically insert the transaction on due date; if off, user must confirm manually).
	•	The form action createScheduled inserts into ScheduledTransaction table.
	•	Frequency handling:
	•	For common frequencies: daily, weekly, monthly, yearly, implement as such. Possibly allow something like “Every X weeks” or “Every X months on day N”.
	•	For monthly, likely want to store the day of month. We can derive it from start date and just increment month by month, adjusting if needed (like for shorter months).
	•	We might not detail exact implementation; many use cases (like last weekday of month, etc.) could be very complex. Stick to simple: exact day interval or date of month.
	•	Mark as Done (Manual):
	•	On the Scheduled page, each upcoming item for today or earlier could have a “Mark Paid” button. Clicking it will:
	•	Create a Transaction record (and participant) just as if the user manually entered it: use the stored description as payee, amount (if expense, likely negative), accountId, categoryId, date = today (or the scheduled date if we want to keep exact).
	•	Possibly allow user to edit the amount or date slightly before confirming (if, say, a bill was a bit different this month). Could make the “Mark Paid” open a confirmation dialog with details and allow changes.
	•	After adding the transaction, update the ScheduledTransaction’s nextDate to the next occurrence:
	•	e.g., if frequency monthly, add one month to current nextDate until it’s in future.
	•	If it was one-time or endDate reached, you could deactivate or delete the schedule.
	•	If autoAdd is false, this is how the user logs it.
	•	If autoAdd is true, ideally the system would automatically perform the above on the due date:
	•	Since we don’t have a persistent background worker in a static deployment, one way is to check on each login or daily if there are any autoAdd items due and not yet added, then add them.
	•	Perhaps implement a check in hooks.server.ts or when the user hits the dashboard: query for any ScheduledTransaction for that user where nextDate <= today and not yet added. For each, do the same as mark paid (create transaction, increment nextDate).
	•	This way, even if user logs in a few days after due, it will catch up and insert the transactions (maybe backdated to the scheduled date).
	•	If user never logs in, auto won’t happen, but they wouldn’t see it anyway.
	•	Document this behavior or leave autoAdd off by default.
	•	Reminders/Notifications:
	•	Without a backend push service, we can rely on visible indicators:
	•	If a scheduled item is within, say, 3 days, highlight it in the list or show it on the Dashboard with a warning icon.
	•	If user has allowed notifications (like via a PWA push or email), we could integrate those. Possibly integrate with Firebase Cloud Messaging or send an email via a backend function when due. This is advanced; as a first pass, just the UI reminder is fine.
	•	On the Dashboard (which we’ll build), show maybe “Upcoming: [Rent $1000 due in 2 days]” etc.
	•	Savings Goals vs Scheduled:
	•	Sometimes people schedule transfers to savings. We’ll handle savings goals separately, but note you could schedule a transfer to savings account monthly. That would just be an account transfer transaction (maybe category “Transfer”).
	•	Testing:
	•	Add a scheduled transaction for something like “Gym Membership, $50, monthly on the 1st, starting next month”. It should appear in the list with next date.
	•	Manually trigger mark as done (maybe change nextDate to today’s date for testing). Click Mark Paid, confirm a transaction was created in the Transactions list with correct details. Check that nextDate incremented by a month.
	•	Test one with weekly frequency.
	•	Test editing a schedule: maybe allow editing via a form if needed (similar to add).
	•	Let a date pass and simulate login: e.g., set nextDate = yesterday, then load dashboard or scheduled page, see it flagged as overdue.
	•	If autoAdd is on for an item, simulate it by calling a function or route that checks auto-add (could be done in page load). Ensure it adds the transaction automatically.
	•	Check that budgets count these transactions (they should, they’re normal transactions once added).
	•	Test a scenario of an income schedule (like salary), to ensure if it auto adds an income transaction, that works too.
	•	Try endDate: e.g., set an end date and mark last occurrence done, ensure it maybe deactivates (you might manually set a flag or just not increment nextDate beyond end).
	•	The UI should handle when no upcoming items (maybe show “No upcoming bills” message).

15. Investment Accounts and Currency Tracking

Extend the functionality to handle investment accounts and multiple currencies:
	•	Investment Accounts:
	•	In the Account model, we have type = INVESTMENT to flag those. These accounts hold assets (stocks, crypto, etc.) whose value fluctuates.
	•	Create an InvestmentHolding model (if needed): Fields: id, accountId, assetType (enum: STOCK, CRYPTO, etc. or a simple string), symbol (e.g., AAPL or BTC), quantity (Decimal), buyInPrice (optional, average cost or so).
	•	Alternatively, some might just manually update their investment account balance periodically. But a better approach is to track holdings and then fetch current prices.
	•	For now, design for holdings:
	•	When user adds an account of type Investment, allow them to input initial holdings. Or provide a way to manage holdings (like a mini-portfolio manager).
	•	Could skip too detailed management and just store a total current balance, but that defeats the purpose of tracking performance.
	•	Fetching Live Prices:
	•	Use an API or library to get prices for given symbols. For example, Yahoo Finance has an API (or unofficial endpoints), or Finnhub, or Alpha Vantage. Some have free tiers or need API keys.
	•	Alternatively, use an open-source approach: yahoo-finance2 npm package can fetch prices. Or since this is not real-time critical, even a daily update via a cron job to store in DB.
	•	For crypto, could use CoinGecko’s free API.
	•	Implement a service (maybe in a server route or scheduled job) that updates prices. Possibly not needed every page load (to avoid rate limits and slow loads). Could do it on Dashboard load but with caching.
	•	Perhaps store in memory or in a cache (like if Redis was available) for a short time.
	•	Or store last fetched price in InvestmentHolding (but that requires updating in DB often).
	•	Displaying Investment Values:
	•	On Accounts page and sidebar, for an investment account show the total current value. How to calculate: sum for each holding = quantity * latest price, then sum holdings.
	•	On an Account detail page (if added), list the holdings with symbol, quantity, last price, total value. If desired, also show change (if you store initial price or last close).
	•	Possibly highlight total gain/loss if you know cost basis vs current (out of scope unless tracking transactions for trades).
	•	For now, we won’t manage individual buy/sell transactions – assume user updates holdings manually or via import.
	•	Updating Holdings:
	•	Provide a UI to add/edit holdings: e.g., for an account “My Robinhood”, user can add symbol APPL, quantity 10. Or if they buy more, update quantity.
	•	If they want to log trades, that could be done either by direct editing or by recording transactions of type “BUY/SELL” which adjust holdings. That is complex; skip for now, assume manual updates or an import tool for holdings.
	•	Currency Conversion:
	•	Many users might have accounts in different currencies (USD, EUR, CAD, etc.). We want to show totals (like net worth) in one base currency for a unified view.
	•	Use an API or service to get exchange rates:
	•	For simplicity, use a free rates API or some static conversion (maybe use European Central Bank daily rates, or an NPM lib).
	•	Could integrate with something like exchangerate.host or currencyapi. Alternatively, since the user is open to advanced stuff, maybe use a remote function here to fetch latest FX.
	•	Store rates in the FXRate model (or fetch on the fly and not store). If storing, perhaps just store a daily rate for each currency pair.
	•	Implementation:
	•	If user has accounts in USD and base in CAD, when displaying net worth in CAD, convert USD accounts using USD→CAD rate.
	•	Determine a base currency (maybe from user settings or default to the currency of majority of accounts or first account). Could ask user in profile “Primary Currency”.
	•	On accounts list or summary, show conversion:
	•	E.g., an account “Bank of America (USD) – $1000 (≈ C$1300)”. So user sees both.
	•	On net worth or totals, sum after conversion.
	•	Use formatting library or Intl API to display currency properly.
	•	Fetching FX:
	•	Possibly fetch when needed (if user has multi-currency accounts, fetch rates on dashboard load).
	•	Use a remote function or server load to call an API (OpenExchangeRates, etc.). If keys required, store in env.
	•	Many free ones have limitations; maybe find one that doesn’t need key for a few requests (like exchangerate.host).
	•	Credit Card Statement Forecast (mentioned in original plan):
	•	For credit card accounts, maybe show an estimate of the upcoming statement balance.
	•	If an account has statementDay (e.g., 20th of month as closing date), and today is between last close and next, sum all transactions on that account since last close date to get current cycle spending. That is likely the amount that will be due.
	•	Also possibly show last statement amount if not paid (if user logs payment differently).
	•	This is an advanced detail: we can incorporate into Dashboard, e.g., “Your Visa card will have ~$500 due on Oct 20”.
	•	Implementation: when listing accounts or on dashboard, check for accounts of type CREDIT_CARD and if statementDay is set:
	•	Determine last close date: if today is Aug 5 and statementDay=20, last close was July 20 (assuming it’s always that date, maybe adjust year/month).
	•	Sum transactions from July 21 to today for that account (expenses minus any payments which are negative amounts on that account, if recorded).
	•	That sum is the current cycle spend (projected statement).
	•	Also could consider adding upcoming scheduled charges if any, but too much.
	•	For now, we can provide a simplified projection ignoring future days.
	•	Testing:
	•	Add an investment account “Brokerage” with some holdings (e.g., 5 AAPL, 0.1 BTC). Use a known price for testing or integrate an API:
	•	If no internet in dev, maybe stub prices or use a static approach (like set a price in a config for now).
	•	On accounts page, see if it shows the converted total. E.g., if AAPL $150 each, BTC $30000 each, total = $1505 + $300000.1 = $750 + $3000 = $3750.
	•	Try updating a holding and see the value change after fetching new price (simulate price change).
	•	Add accounts in two currencies, say one in USD one in EUR, base currency set to USD. Fetch EUR→USD rate (e.g., 1 EUR = 1.1 USD). See that net worth sums correctly (account values converted).
	•	Change base currency (if user can; or simulate by deciding base as CAD and provide rate USD→CAD).
	•	Test credit card forecast:
	•	Set an account as CREDIT_CARD, statementDay=15. Add some transactions after the last 15th. On Aug 10, last close was July 15, so sum transactions after July 15. Check the forecast number.
	•	If possible, mark one scheduled transaction before next 15 and see if maybe mention “plus upcoming $X”.
	•	Not too detailed – just ensure the logic picks up current cycle expenses.

16. Dashboard Overview Page

Build the Dashboard to give a quick overview of the user’s financial status and important info:
	•	Net Worth Widget: At the top of the dashboard, show Net Worth (Assets minus Liabilities):
	•	Calculate: sum of all account balances where type is not liability (like cash, bank, investments as positive) minus sum of liabilities (credit card balances if we treat them as debt, perhaps we consider credit card balance as negative if it has a balance due).
	•	Alternatively, sum all accounts (assuming credit accounts have negative balances entered if money owed, which we might not have done; if we always keep account balances as positive absolute amounts, we need to subtract credit accounts differently).
	•	For clarity, perhaps treat credit accounts balance as negative in the net worth calc if they have a positive outstanding (like if credit card currentBalance = 500 meaning you owe 500, treat that as -500).
	•	Display net worth as a big number. Possibly color-coded if negative (red) vs positive (green).
	•	Could include an icon or small trend indicator (if we have historical net worth data – maybe we can compute last month’s and show an arrow up/down).
	•	If implementing charts later, we might replace this with a mini chart or have a link to a full net worth chart.
	•	Shared Expenses Summary: A section showing how much the user owes or is owed in total:
	•	“You owe: $X” (sum of all pending where current user owes others).
	•	“You are owed: $Y” (sum of all pending where others owe current user).
	•	If both non-zero, show both. If one is zero, emphasize the other.
	•	Possibly an option to “Settle up now” linking to the Shared page if they owe, or to remind others if they are owed (though we have no feature to remind aside from maybe re-sharing the list).
	•	This keeps shared balances in mind for the user.
	•	Budget Overview: Summarize the current month’s budget status:
	•	For example: “Overall Budget: $2000 allocated, $1800 spent, $200 remaining” for the month.
	•	Or if the user doesn’t budget everything, maybe sum only categories that have budgets. But the simplest is sum of all budgets vs sum of expenses for those categories.
	•	If overspent overall, highlight in red “Over budget by $X”.
	•	Possibly show a combined progress bar: how close total spending is to total budget.
	•	Also highlight maybe the worst category (like “Overbudget in Dining by $50”) or number of categories over/under.
	•	Provide a link or button “View Budget Details” to go to Budgets page.
	•	Credit Card Alerts: If any credit card accounts have a statement coming or high balance:
	•	For each credit account, if current date is close to statement due (if we know due date) or just always show:
	•	e.g., “Visa ending 1234: Balance $500, due Sep 20 (projected)”.
	•	Or “Visa: $500 current balance, statement closes in 5 days”.
	•	If the user usually pays it off, you might also show if they have enough in checking to cover it (like a ratio of checking vs card balance).
	•	This is more of a nice extra; at least one line per credit account with a due or projection.
	•	Upcoming Bills (Scheduled): Show the next 3 scheduled transactions that are due soon (within next, say, 30 days):
	•	For example: “Rent $1000 – due in 3 days”, “Netflix $15 – due in 10 days”.
	•	If any are overdue (past date and not marked done), show “Overdue: [Item name] $X was due [date]” in red.
	•	Provide a quick “Mark as Paid” button next to each so user can do it right from dashboard.
	•	Or at least link to scheduled page.
	•	If none upcoming in next month, could omit or say “No upcoming bills in next 30 days”.
	•	Recent Transactions: Sometimes dashboards include a quick list of the most recent transactions added (for quick reference or to ensure nothing looks fraudulent).
	•	We could show the last 5 transactions across all accounts: date, description, amount.
	•	This can reassure the user that data is up to date or let them catch an entry mistake.
	•	If implementing, fetch transactions sorted by date desc limit 5.
	•	Possibly link each to full transactions page or account detail.
	•	Quick Add Buttons:
	•	A set of shortcuts for common actions:
	•	“Add Transaction” (opens the modal form we made, perhaps we can use it here as well),
	•	“Add Income” (maybe same form but toggled to Income type),
	•	“Add Transfer” (if we implement transfers: maybe open form for transferring between accounts),
	•	“New Budget” or “New Account” etc., but those are less frequent.
	•	Using nice icons (plus sign, etc.) for these. The shadcn-svelte library likely has a Floating Action Button or similar, but we can also just have buttons in a section.
	•	These should work seamlessly (open dialogs, use our existing actions).
	•	AI Insights: If we have the AI integration (coming next step), possibly show the top insight on the dashboard:
	•	E.g., a box saying “Insight: You spent 15% more on groceries this month compared to last. Consider adjusting your budget or cutting back.” with a prompt like “See more insights” linking to a full insights page.
	•	If we generate insights on the fly (which might be slow/costly), maybe don’t auto-generate on every load but have a refresh button or generate once per week.
	•	For now, maybe a placeholder that will be filled by Step 17.
	•	Design & Layout:
	•	Use a grid or flexbox to arrange these widgets. On a wide screen, maybe have 2-3 columns of cards:
	•	Left column: Net Worth (small card), Shared Summary (small card), Credit Alerts (small list).
	•	Middle: Budget overview (medium card with maybe a progress donut or bar), Upcoming Bills (list).
	•	Right: Recent Transactions list, maybe AI Insight card.
	•	On mobile, these would stack vertically.
	•	Use shadcn-svelte components like Card for each widget, with appropriate styling (card header, card content).
	•	Possibly use icons (like a net worth icon, budget icon, etc. from a library or shadcn’s icons).
	•	Testing:
	•	Ensure that each piece displays correctly with sample data:
	•	If user has multiple accounts and currencies, net worth calculation correct and displayed clearly.
	•	If user has any pending IOUs, those numbers show up.
	•	If budgets set, the progress bar shows correct usage (simulate at start vs end of month values).
	•	If no budgets at all, handle gracefully (e.g., show “No budgets set” or skip that widget).
	•	If credit accounts present, see the alert string formatting.
	•	If scheduled transactions present, they list properly with relative time (“in X days” perhaps).
	•	If no scheduled items or no shared balances, those widgets could be hidden or display “All clear!” type message to not show an empty card.
	•	Test the quick add: click “Add Transaction” on dashboard, ensure it opens the same form modal and on submit, adds the transaction and updates the recent list widget and accounts balances on dashboard (we might need to refresh data or use events—maybe simplest is to do a full page invalidate or reload dashboard on submission success).
	•	Check responsiveness: shrink screen, see that cards stack nicely and none are cut off. Possibly adjust text for small width (like “You owe” vs “You owe $X” might break line).
	•	Check that the dashboard doesn’t take too long to load. If we are doing many calculations (net worth summing all accounts and maybe summing transactions for budgets, etc.), ensure queries are efficient:
	•	We might load a lot: accounts (with balances and currencies), budgets for current month, sum of transactions for month (for spent), pending participants, scheduled items, etc. We can combine some queries or at least ensure each is reasonably quick (with indices).
	•	If performance issues, we might pre-compute some aggregates (like store monthly spending totals somewhere), but probably fine for now with moderate data sizes.

17. AI Insights Integration

Integrate an AI-powered insights feature that analyzes the user’s financial data and provides personalized tips or observations:
	•	Purpose: Provide value-added analysis like:
	•	Noticing trends (increasing spending in a category, consistent under-utilization of a budget, large changes in net worth, etc.).
	•	Suggestions (where to cut down, how to reallocate budget, suggest a savings goal based on surplus, etc.).
	•	Warnings (low balance vs upcoming bills, too much debt relative to income).
	•	Compliments (stayed under budget, improved savings rate).
	•	Data to Analyze: Gather key information to feed into the AI:
	•	Recent months’ spending by category.
	•	Budget vs actual for those months.
	•	Net income (income minus expenses) trends.
	•	Big transactions or unusual spikes.
	•	Upcoming obligations (like if a big bill is due and accounts are low).
	•	Shared expenses situation (maybe note if you keep owing someone often).
	•	Savings goals progress (if behind or ahead).
	•	The AI doesn’t need raw transaction-level data (too much detail) – we summarize statistics.
	•	For example, a summary could be:
	•	“In August 2025, you spent $200 more than your $500 budget on dining out. You have a net worth of $10,000 which increased by 5% last month. You owe $100 to friends and are owed $50. Your credit card balance is $500 due next week. You saved $300 this month towards your goals.”
	•	We can compile such a paragraph or a bullet list of facts.
	•	Using OpenAI (or similar):
	•	We would likely use the OpenAI API (GPT-4 or GPT-3.5) to generate the insight text. Since we are in 2025, assume GPT-4 or newer is available.
	•	Prepare a prompt carefully: e.g.

"You are a personal finance assistant. The user’s recent data:
 - Dining Out budget was $300, spent $450 (150 over).
 - Grocery budget $400, spent $380 (under).
 - Net worth is $X, up from $Y last month (increase Z%).
 - Upcoming bill: $500 credit card due in 5 days, checking account balance $600.
 - Shared expenses: user owes $100 to others.
 - Savings goal 'Vacation' is 40% complete, due in 6 months.
 Provide 2-3 insightful suggestions or observations for the user to improve finances or note something significant."


	•	The model would then produce something like:
	•	“You overspent on Dining Out by $150 last month. Consider cutting back on restaurants or increasing your dining budget to a realistic amount.
Your net worth grew by 5%, great job – mostly due to consistent saving.
Remember your credit card bill of $500 is due in 5 days; you have enough in checking to cover it, but it will significantly reduce your balance – plan your expenses accordingly.
You might want to accelerate savings for ‘Vacation’ by putting aside an extra $50 each month to meet your goal in time.”
	•	We can parse or directly use that text (ensuring it’s not too long).

	•	Integration in App:
	•	Provide a section on the Dashboard (as mentioned) or a dedicated Insights page (/insights).
	•	Perhaps a button “Generate Insights” on dashboard or insights page, so it’s user-initiated (to avoid cost on every load).
	•	If user clicks, call a remote function or endpoint that gathers data and calls OpenAI API, then returns the result.
	•	Since this is sensitive data, ensure the prompt does not include personally identifiable info beyond first name if needed (but likely not needed).
	•	The remote function approach: we can create generateInsights.remote.ts where on server it collects data from DB and calls OpenAI. Using SvelteKit’s remote experimental feature (if enabled) allows calling this from the component easily.
	•	Display the resulting insights nicely, possibly as bullet points or separate paragraphs with icons (like a lightbulb icon for each insight).
	•	You can also label the categories of insights if easily parsed (e.g., if the tip contains the word “budget” or “credit card”, maybe add an emoji).
	•	Provide a disclaimer: “Insights are generated by AI based on your data; use advice at your discretion.”
	•	Performance & Cost:
	•	Since calling OpenAI costs tokens, maybe limit usage or use a smaller model for shorter responses.
	•	You could store the last insights generated (and when) to avoid re-calling too often. Maybe auto-refresh it weekly or on significant data changes.
	•	Possibly generate asynchronously: user clicks, we show “Generating…” spinner (because GPT-4 could take a few seconds), then display.
	•	Testing:
	•	Without actual API in dev, you could stub the response or use a sample prompt with a known library.
	•	If possible, test with actual OpenAI (with a trial key) to see the format.
	•	Provide it some sample data and see if the outputs are reasonable or need refining prompt.
	•	Adjust prompt if AI gives irrelevant or overly generic answers. Make it focus on the specifics provided.
	•	Test with scenarios:
	•	Overspending scenario, see if it catches and suggests reducing spending.
	•	Underspending (way under budget) to see if it suggests lowering budget or reallocating.
	•	High debt scenario (lots of owed and low net worth) to see if it warns.
	•	High net worth growth scenario to see if it suggests investments (maybe out of scope).
	•	If any hallucinations or mistakes (like it suggests something not in data), refine prompt to be more explicit.
	•	Ensure the insights text fits in the UI design. Possibly limit to 3-5 bullet points max.
	•	If the user has very little data (e.g., first month using app), the insights might be minimal or the model might struggle (“I notice you have not set any budgets yet, maybe do so.”) – which could be actually a useful suggestion. Ensure to handle empty data: you might craft a prompt differently if budgets are empty or goals are none (like instruct AI to encourage using features).
	•	Privacy:
	•	Because we send financial data to OpenAI, ensure user is okay (maybe mention in privacy policy or have a toggle for AI usage).
	•	If concerned, one could keep data anonymous (don’t include names or emails, just numbers).
	•	The output should not include any private data aside from the financial metrics.

18. Savings Goals Feature

Introduce a Savings Goals feature that allows users to set and track progress towards specific financial goals (e.g., saving for a vacation, emergency fund, etc.):
	•	SavingsGoal Model: Define a new model in Prisma (if not already anticipated):
	•	Fields: id, userId (relation to User), name (e.g., “Vacation Fund”), targetAmount (Decimal), currentAmount (Decimal, how much is already saved towards the goal), targetDate (Date, optional deadline for the goal), and maybe priority or order if you want to sort them.
	•	We could also link a goal to a specific account if the user is physically storing money in an account for it (like a savings account). But often, goals are conceptual (YNAB style) or across accounts. If we want, add accountId optional to indicate an account containing this savings (or we might not, leaving flexibility).
	•	Add this model and run prisma migrate dev to update the schema.
	•	Goals Management UI:
	•	Create a Goals page (maybe /goals or under accounts or budgets section). We can also link it in the sidebar, perhaps under Budgets or as its own item “Savings Goals”.
	•	On the Goals page, list all goals for the user. For each goal, show:
	•	Name,
	•	Target Amount (e.g., $5000),
	•	Current Amount saved (e.g., $1500),
	•	Progress = (current/target * 100%),
	•	Target Date if set (e.g., “by Dec 2025” or “in 6 months”).
	•	Possibly an indicator if they are on track or not: you can calculate how much they should have saved by now to meet the deadline (if targetDate given). For example, if goal is $5000 in 10 months, that’s $500/month; if 5 months in they have $1500, they’re on track ($1500 vs $2500 needed by now? No, that’s behind). A simple on/off track message could be shown.
	•	A progress bar or radial chart to visualize progress (shadcn-svelte has Radial chart or we can use a simple progress bar component).
	•	If targetDate is near and they are far behind, highlight in red or warning.
	•	Provide an Add Goal button to create a new goal:
	•	Use a dialog form: Fields: Name, Target Amount, Target Date (optional), maybe choose an icon or color (just cosmetic).
	•	On submit, an action createGoal inserts into DB with currentAmount default 0.
	•	Contribute to Goal: For each goal, user needs to update the saved amount as they put money aside:
	•	We can implement a simple “Add Contribution” action. Perhaps each goal row has a field or button “Add Money” which opens a small form to input an amount that you have saved towards this goal.
	•	When submitted, we increment that goal’s currentAmount by the input.
	•	Optionally, also create a Transaction to reflect moving money into a savings account. This ties to whether a goal is linked to an account:
	•	If the user is actually moving money to a specific account for this goal, they could select that account in the contribution form and then we record a transfer transaction (from, say, checking to savings account).
	•	If not linking accounts, the goal is just conceptual, so we don’t create any transaction; user will handle money outside the app or via normal transactions.
	•	To keep it simple: perhaps ask “From which account are you saving this money?” If they choose one, we can create a transfer transaction for that amount to a “virtual goal account” or to nowhere. But it might be easier to not create any actual transaction (just let user manage the actual money externally).
	•	We could also allow negative contributions (withdrawals from the goal) if needed (someone had to dip into the fund).
	•	Alternatively, treat savings goals like their own pseudo-accounts: if user has a “Vacation goal” and they actually opened a bank account for it, they’d probably just add that as an account. But if not, this feature covers conceptual saving where money might still be in a general account but mentally allocated.
	•	If implementing as conceptual, we might not reflect in net worth because that money is presumably already counted in an account. It’s just earmarked. So currentAmount is not extra money, it’s part of their assets just tagged for this goal.
	•	With that approach, adding a contribution doesn’t change net worth or accounts (so no double counting), it just shifts some funds mentally. So probably don’t create a separate transaction unless linking to accounts for actual moves.
	•	Goal Detail (optional):
	•	Could have a page or modal that shows more info on a goal: history of contributions, maybe ability to edit name/target, etc.
	•	We might skip for now and allow editing inline or in the row (like clicking the name or target turns into an input).
	•	Deleting a goal should be possible (with confirmation, especially if currentAmount not zero, maybe ask if they want to reallocate that money somewhere else or just remove tracking).
	•	Dashboard Integration:
	•	On the Dashboard, show a summary of goals:
	•	If 1-3 goals, maybe show each with progress bars in a “Goals” widget.
	•	If many, maybe just show the top priority or the one nearest deadline.
	•	Or simply show total saved across goals vs total targets (less meaningful though).
	•	Possibly highlight the most behind schedule goal.
	•	Provide link “View all goals” to the Goals page.
	•	Reminders/Insights:
	•	We could integrate with AI insights: if a goal is nearing and user is behind, the AI might mention it (“Your Vacation goal is 40% funded with 3 months left; consider saving $X more per month to reach it”).
	•	Also maybe send a reminder or notification when the target date is close and goal not met.
	•	But for now, a visual warning (like a red progress bar or an icon) is fine.
	•	Testing:
	•	Create a goal “Emergency Fund $10000 by Dec 2025”. Save it. It should appear with 0% progress.
	•	Add a contribution of $1000. Verify currentAmount becomes 1000, progress 10%.
	•	Add another $500, now 15%. Check that it shows updated.
	•	If targetDate is Dec 2025 and today is Aug 2025, that’s ~16 months left, needed rate ~$562. If they only have $1500 now, maybe on track? Actually $1500 in first month or so is above monthly goal, but we won’t overthink. Possibly in the UI say “Needs ~$562 per month” calculation for user to know required pace.
	•	Create another goal without a target date (like “New Car $5000, no deadline”). It should show just the progress without time.
	•	Test editing the goal (if implemented, e.g., change target or name).
	•	Test deleting a goal.
	•	Check that in net worth calculations or anywhere else, the goal money isn’t double counted or subtracted incorrectly. Since we didn’t tie it to accounts, net worth remains just sum of accounts.
	•	If the user does use a specific account for goal, they might manually transfer funds to that account and mark contributions in the goal too. That’s fine; then the money is in a savings account (counted in net worth) and also counted in currentAmount for goal, but that duplication is intentional because one is conceptual allocation.
	•	Ensure the goals list and dashboard snippet look good on mobile vs desktop.
	•	Possibly check extreme cases: goal achieved (current >= target):
	•	If currentAmount equals target (or beyond), mark goal as completed. Maybe visually show 100% or even confetti icon.
	•	If beyond target (should rarely happen, but if user oversaved or interest caused growth), could show >100% or just cap at 100 and note exceeded by $.
	•	Completed goals might be separated or allow user to mark as done and maybe hide from active list.
	•	For now, if current >= target, we can highlight or let user delete it since they achieved it.
	•	This feature will help users plan savings outside of monthly budgets (which are for expenses).

19. UI/UX Enhancements and Polish

Now that core features are built, refine the UI/UX for intuitiveness, speed, and aesthetics:
	•	Use Dialogs and Modals: Ensure that creation/edit forms for most entities use modal dialogs for a smoother experience (as opposed to navigating to new pages).
	•	We already implemented dialogs for adding accounts, categories, transactions, etc. Double-check consistency:
	•	All “Add” buttons open a modal with a form.
	•	The modal should close on successful submission and perhaps show a toast or update the relevant list in background.
	•	If submission fails (validation error), the modal should remain open and display errors near fields.
	•	Using shadcn-svelte’s Dialog component, style them uniformly (maybe a max-width and nice padding).
	•	Check that modals are accessible (focus trap, can close with Esc, etc., which the library likely handles).
	•	Always-visible Summary Bar: Implement the summary bar we planned in the layout:
	•	We want a bar (maybe at top of content or bottom of screen) that displays key high-level info:
	•	Possibly total balances of active accounts or a quick net worth snapshot.
	•	Or a horizontal list of accounts and balances.
	•	One approach: a scrollable horizontal list of account chips:
	•	Each chip showing “Account Name: $Balance”. This allows many accounts to be shown by scrolling.
	•	Use Tailwind to make it horizontally scrollable (overflow-x auto).
	•	Mark hidden accounts not included.
	•	Alternatively, show aggregated: “Cash: $X, Credit Owed: $Y, Investments: $Z, Net Worth: $N”.
	•	This might condense info. But user specifically said for each account displayed, show balance.
	•	Perhaps combine: group accounts by type in the bar:
	•	e.g., “🏦 Bank: $5000, 💳 Credit: -$500, 💰 Cash: $200, 📈 Investments: $10k”.
	•	Or just list accounts one by one with an emoji or icon for type.
	•	Place this bar below the main header but above page content, or fixed at bottom. If fixed, ensure it doesn’t cover content or is too tall.
	•	Provide a toggle to show/hide this bar if user wants (maybe a small ^ collapse).
	•	Ensure it’s responsive: on small screens, maybe it becomes a swipe-able carousel of accounts.
	•	Performance and Snappiness:
	•	Use Svelte’s reactivity and stores to our advantage:
	•	For example, after adding a transaction, instead of full reload, we can push the new transaction into a Svelte store or trigger an invalidate of the data which will refresh part of the page.
	•	Similarly for accounts: after adding or editing, update the accounts list store that sidebar and summary bar use.
	•	Implement optimistic UI where possible:
	•	E.g., when marking a bill as paid on dashboard, you might immediately remove it from upcoming list and increment account balance, before the server confirms. If the server fails, you can revert or show an error.
	•	This might be overkill, but small touches like that give a feeling of speed.
	•	Check that all lists and pages load quickly. If any is slow (maybe transactions list if thousands of records), implement pagination or lazy loading:
	•	For transactions, we could implement infinite scroll or a “Load more” button after, say, 50 items.
	•	Or load by month segments, which naturally breaks it down.
	•	Use skeleton loaders or spinners when data is loading:
	•	SvelteKit usually SSRs so data is there on initial load. But for actions where data changes, you can show a loading state.
	•	For example, when switching month filter on budgets, if it triggers a load, maybe show a spinner in the table while waiting.
	•	The shadcn-svelte library might have a Skeleton component or use Tailwind animate-pulse on dummy elements.
	•	Transitions:
	•	Use Svelte transitions or animations for adding/removing elements:
	•	E.g., when a new transaction appears in the list, fade it in or highlight briefly.
	•	When deleting an item, maybe fade it out.
	•	Use transition: directives or shadcn-svelte’s built-in animations if any.
	•	Keep them subtle and fast so as not to feel sluggish.
	•	Hiding Unused Accounts:
	•	We added the ability to hide accounts; ensure the UI to manage this is user-friendly:
	•	On Accounts page, maybe a checkbox “Show hidden accounts” that toggles a list of archived accounts.
	•	Hidden accounts should not appear in the sidebar or summary bar.
	•	If a hidden account has transactions, those transactions still show in the global list (maybe with account name indicating it’s hidden or archived).
	•	Provide an “Unhide” button on hidden accounts to bring them back.
	•	Perhaps automatically hide accounts with zero balance that haven’t been used for a long time? Could be a future feature, but at least manual control exists.
	•	Test hiding/unhiding from the Accounts page. Also test what happens to that account’s budgets or scheduled transactions (likely still exist, but if hidden perhaps you skip them? No, scheduled should still run unless user disables it).
	•	Theming and Polish:
	•	Choose a nice default theme (colors, maybe use a shadcn preset theme or adjust Tailwind config for brand colors).
	•	Ensure consistent use of spacing, font sizes, and components across pages.
	•	Add app logo or name in sidebar/top (maybe just a text “Pennywise” or a simple icon).
	•	Ensure mobile styling is good:
	•	Possibly implement a different navigation approach on mobile: e.g., a bottom nav bar for key sections (Dashboard, Transactions, Budgets, Shared) and hide the sidebar entirely. This could be done by conditionally rendering a mobile nav when screen small (using Tailwind’s responsive utilities).
	•	The sidebar could become a hamburger drawer. We might have left that to do: implement a button in header that toggles a Drawer containing the sidebar content for mobile users.
	•	Use shadcn-svelte’s Sheet or Dialog for the menu.
	•	Add tooltips on some icons if not obvious (like an edit pencil might not need, but a cryptic icon should have a tooltip).
	•	Use proper date and number formatting (maybe use Intl.DateTimeFormat and Intl.NumberFormat for locale-specific formats).
	•	Check accessibility:
	•	All buttons and inputs have labels or aria-label.
	•	Can navigate forms with keyboard, modals trap focus and can be closed with Esc.
	•	Color contrast for text vs background meets standards (Tailwind + shadcn default should be okay).
	•	Add a favicon and app icon (if making PWA). Possibly generate a simple one with the letter P or a coin icon.
	•	If PWA, ensure manifest.json is created (SvelteKit has an add-on or do manually).
	•	If notifications for bills, consider requesting Notification permission if going to use it (not implemented fully though).
	•	Testing UX:
	•	Simulate common tasks from a fresh user perspective:
	•	Sign up, create a couple accounts, add a budget, log some transactions, split one, add a friend and share an expense, settle it, create a goal, etc. Do these in the most natural way on the UI and see if any step is confusing or cumbersome.
	•	Note any extra clicks that could be avoided and refine. For example, after adding an account, maybe auto-close the modal and show a success toast so user isn’t left wondering.
	•	Check that forms auto-focus the first field when opened (for convenience).
	•	Check that pressing Enter in a single-field form (like adding category) submits it.
	•	If any long-running action (like import), show progress or at least a “processing…” message.
	•	Try on a mobile device (or emulator): small screen, touch interactions:
	•	Is the Add Transaction button easily tappable? Are form controls not too small?
	•	Does the numeric keyboard come up for amount fields (use inputmode="decimal" or type=number appropriately).
	•	Do modals fit on screen without scrolling issues on mobile.
	•	Fine-tune spacing or flex layout issues found during testing. Use developer tools to inspect any overflow or misalignment.
	•	Confirm that all major features have a navigation path (user can find them). If some are hidden (like Goals page not linked), add links. The sidebar should have everything or at least everything accessible from something.
	•	The app should now feel cohesive and user-friendly, with consistent UI patterns (dialogs for create/edit, tables or lists for data, etc.).

20. Reports & Charts Integration

Introduce data visualization using shadcn-svelte’s chart components and create a Reports section for deeper insights:
	•	Reports Page (/reports):
	•	Provide an interface for generating various financial reports with charts. The page can have multiple tabs or dropdown to select report type:
	•	e.g., “Spending by Category”, “Spending Over Time”, “Net Worth Over Time”, “Income vs Expenses”, etc.
	•	Initially, implement 2-3 key charts:
	1.	Spending by Category (Pie Chart):
	•	For a given period (say the current month by default, with option to change month or select year), show a pie or donut chart of where the money went by category.
	•	Use shadcn-svelte’s Pie Chart component. Provide it data like [{name: ‘Groceries’, value: 500}, {name: ‘Rent’, value: 1000}, …].
	•	The data can be obtained by summing TransactionParticipants for each category in the period.
	•	This gives a quick visual of proportions.
	•	Possibly allow switching to a bar chart for the same data if too many categories (bars with categories on x-axis).
	2.	Spending Over Time (Area/Line Chart):
	•	Show how expenses (and optionally income) trend over the last N months.
	•	Data needed: for each month (say last 6 or 12 months), total expenses and total income.
	•	Use an Area Chart or Line Chart with two lines (one for expenses, one for income). Or a single line if focusing on net cash flow.
	•	The shadcn-svelte Area Chart can be used; the example might be single series though. If multiple series, perhaps use the Line Chart variant or a stacked area.
	•	For each month label (e.g., “Jan 2025”), we plot expense total (as a positive number maybe, or if using negative we take absolute).
	•	Another alternative: separate charts for income and expense.
	•	A nice addition: shade area between them to indicate net savings, but that’s complex. Simpler: just show two lines.
	3.	Net Worth Over Time (Area Chart):
	•	Track net worth by month (or quarter/year).
	•	Compute net worth at end of each month historically. If we didn’t explicitly store it, we can approximate by summing account balances as of that date. That requires summing initial balances + transactions up to that date for each account.
	•	If data volume is moderate, we can do that for, say, last 12 month-ends via queries.
	•	Alternatively, if we maintained a history of net worth (some apps prompt user to update property values etc., but we can assume accounts suffice).
	•	Plot an area chart where Y = net worth, X = time.
	•	If there were big jumps, maybe user added an account or windfall, the chart will reflect that.
	•	This chart gives an idea of overall financial progress.
	•	Other possible charts:
	•	Category trend (line chart per category over months), but could be cluttered if many categories (maybe allow selecting one category to see its trend).
	•	A bar chart comparing this month vs last month by category (which categories increased or decreased).
	•	If time permits, one could add an “Expenses by Category over Year” stacked bar per month, but that’s more complex and heavy for UI.
	•	Start with simpler ones above.
	•	The Reports page can have a filter at top for date range (like year or custom range) that affects relevant charts.
	•	Use shadcn-svelte chart components:
	•	The site shows code for Area, Bar, Pie, etc. We can copy the component usage.
	•	These likely depend on a library called LayerChart (the doc mentioned built with LayerChart). Ensure to install any needed packages (maybe already included with shadcn-svelte).
	•	Check if any setup needed (like import a Chart component plugin or ensure certain scripts).
	•	Possibly, the charts require passing data as props. We should refer to a code example:
	•	The area chart likely expects something like an array of series, each with data points.
	•	If docs not clear, might need to experiment, but likely they give sample code to copy.
	•	We might have to ensure reactivity: if user changes filter, update the chart data.
	•	If charts are SVG or canvas, ensure responsiveness (should scale to container width).
	•	Visual polish:
	•	Add titles to each chart (e.g., “Spending by Category – September 2025”).
	•	Use legends if multiple series (the library might include legend support).
	•	Use distinct colors (the library should auto assign or allow theme colors).
	•	If data values are too small (lots of tiny slices in pie), maybe group small ones as “Other” (if needed).
	•	Dashboard Charts:
	•	We can also incorporate a small chart on the Dashboard:
	•	Perhaps a mini area chart showing last 6 months net worth or expense trend.
	•	The user specifically referenced shadcn-svelte charts/area in the prompt, possibly wanting to use an area chart in dashboard.
	•	We can put, for example, an area chart showing total spending last 6 months in the Budget widget or an income vs expense area behind the net worth card.
	•	Or a radial progress chart for budget used (shadcn-svelte also has Radial chart).
	•	Implement one if it adds value:
	•	For example, Radial chart for “Overall budget used: 90%” might be nice in the budget overview.
	•	Or an area chart for net worth trending up by X% as in their example.
	•	If time, add radial progress: maybe total spent vs budget as a radial progress (like a donut showing percentage used).
	•	The chart library might have something, or we can simulate with a pie chart with two values (spent vs remaining).
	•	Make sure these little charts don’t overwhelm load time (should be fine).
	•	Interactivity:
	•	The charts might be static images or canvas. If interactive (hover to see values), that’s great. If not, at least label key points:
	•	On pie, could have labels or tooltip on slice hover.
	•	On line chart, tooltips on points for exact values.
	•	The shadcn-svelte chart likely supports tooltips and maybe zoom or something minimal.
	•	If user wants to drill down from a chart:
	•	E.g., clicking a category slice could filter transactions page to that category for that period. We could implement that as an onClick event (if library supports onClick on slices) that navigates or filters.
	•	Or simply mention “to see details, go to Transactions and filter by category/date”.
	•	Testing:
	•	Generate some sample data:
	•	E.g., for last 6 months, pretend net worth values or calculate from existing accounts and transactions.
	•	Ensure the queries for chart data are correct:
	•	For spending by category: test for a month where user has multiple categories with data, see if pie chart segments match known totals.
	•	For line chart: if in dummy data, perhaps set something like each month’s expense = incremental values, see if line goes up accordingly.
	•	Use small data set to verify visually:
	•	If only one category has spending, pie chart should be one full slice (which is trivial).
	•	If multiple categories, see that colors differ and percentages correct (maybe label largest with percentage).
	•	For net worth chart: if easy, just manually set an array [1000, 1500, 1400, 1600…] for 6 months and pass to chart, see if it plots as expected and x-axis labels align with months.
	•	Check responsiveness: charts should resize or at least scroll on mobile if too wide. Possibly make them full-width on small screens (stack vertically).
	•	Check performance: Loading the reports page will run queries for potentially many transactions (for year-long or multi-year charts).
	•	We can optimize by using aggregate queries rather than pulling all data:
	•	e.g., SELECT categoryId, SUM(amount) FROM TransactionParticipant WHERE userId= X AND date BETWEEN ... GROUP BY categoryId for pie chart. Prisma can do .groupBy or we might raw SQL if needed.
	•	For line charts, similar approach but grouping by month: e.g., use date_trunc to month and sum. Or fetch all transactions for period and then group in JS (fine if not huge).
	•	We should ensure indexes on date fields and such for efficiency.
	•	UI: ensure it’s clear what each chart represents and any filter is visible. If multiple charts, maybe separate sections with subheadings.
	•	The charts should make the app more visually appealing and provide at-a-glance info complementing the numbers. This satisfies the user’s request to use shadcn-svelte charts.

21. Adopting SvelteKit’s New Async & Remote Functions

Upgrade the app to leverage upcoming SvelteKit features like asynchronous components and remote functions for an even cleaner and more efficient architecture:
	•	Enable Experimental Features:
	•	Update svelte.config.js to enable the experimental flags:

const config = {
  kit: {
    // ... other config
    experimental: {
      remoteFunctions: true
    }
  },
  compilerOptions: {
    experimental: { async: true }
  }
};

This turns on support for <script context="module" async> and .remote.ts files as per the new SvelteKit RFC ￼ ￼.

	•	Since this is a bleeding-edge feature (possibly requiring a specific version or branch of SvelteKit), ensure the package version is updated (maybe a canary release). The user indicated willingness to use that version, possibly via a PR branch.
	•	You might need to install a specific SvelteKit version or Git commit. The Reddit/GitHub links suggest it might be available in mid-2025. If not stable, proceed with caution, but for our plan, assume we can try it.

	•	Remote Functions Basics:
	•	A remote function is defined in a file ending with .remote.ts and can be imported in a Svelte component like a normal function. When called from the client, it actually performs an RPC to the server to execute the function and returns the result.
	•	This eliminates writing a separate API endpoint and also provides type safety and simplicity ￼. Essentially, SvelteKit will generate a fetch under the hood when you call it from client, but you as a developer just see a function call.
	•	We will use this to simplify some of our existing actions or new interactions.
	•	Using Remote Functions for Actions:
	•	Identify some places where form actions or API endpoints can be replaced with remote calls for a more seamless experience (especially ones that would otherwise require an extra page reload if not using JS).
	•	Good candidates:
	1.	AI Insights Generation: Instead of creating a special endpoint for OpenAI call, define src/lib/ai/insights.remote.ts exporting an async function generateInsights(). This function (server-side) will:
	•	Query the necessary data from DB,
	•	Call the OpenAI API with the compiled prompt,
	•	Return the generated insights text.
	•	On the client (Dashboard or Insights page), import and call const tips = await generateInsights(); directly in the <script> of the component. Because we have asynchronous component support, we can do await at the top level of the component to fetch these insights on the fly ￼.
	•	The UI can show a loading state while waiting (or because it’s top-level await, the component might not render fully until it’s resolved, which is also fine if small delay).
	•	This remote function call will automatically include the user’s session (likely via cookies) so event.locals.user is available inside generateInsights to get userId and do queries. (The specifics of context in remote functions I’m not 100% on, but presumably it has access or we may need to accept a param like userId, but that can be manipulated so probably they tie it to session).
	•	This approach is secure as long as we rely on session cookies for auth, same as page loads.
	2.	Quick Actions: e.g., marking a bill as paid, toggling an account hidden, etc. Right now we might be using form actions for those. With remote, we can do:
	•	Define toggleAccountHidden.remote.ts that toggles isHidden for an account (after verifying user owns it).
	•	In the Accounts page component, instead of a form submission, simply call await toggleAccountHidden(accountId, newValue), then update the local state (or since remote functions are supposed to update data, maybe we refetch accounts, or the function returns updated account).
	•	This feels like calling a client method but actually runs on server, which is more direct.
	•	For marking scheduled transaction done: a markScheduledDone.remote.ts to create the transaction and update schedule, then from UI call it and directly update UI (like remove from upcoming list).
	•	Because remote functions return a promise, we can integrate that with Svelte’s reactivity or use on:click={async () => { await markScheduledDone(id); removeFromList(id); }}.
	•	This removes the need for a form and page reload, making it snappier.
	3.	Add Transaction (maybe): We already have a form and action, which works with or without JS. If we wanted, we could also expose adding transaction as a remote function, and call it directly for immediate response:
	•	e.g., addTransaction.remote.ts that takes the transaction data and returns the created record.
	•	In the Add Transaction modal component, instead of using <form> with action, we could do our own form handling in JS: on submit event, gather data, call await addTransaction(data), then if success, update state (like push to transactions list or close modal).
	•	However, doing so would break the no-JS fallback (since if JS disabled, that form wouldn’t know what to do). We can actually have both: keep the <form action= for no-JS, but intercept it with JS (or simply call remote function on click and not even use the form).
	•	Possibly too much duplication. We might not convert all such forms because SvelteKit’s form actions already gave us a progressive enhancement path. Remote functions are more like an RPC alternative to writing a separate API route. They excel where you want to call something from component logic rather than through the HTML form.
	•	E.g., AI insight is perfect for remote because it’s not tied to a form (just generating data when needed).
	•	Quick toggles are also ideal (no form, just a button that triggers a server action).
	•	Progressive enhancement: Keep in mind, not all users might have the latest JS environment or might have JS disabled. The form actions we have ensure functionality without JS. Remote functions presumably only work with JS (as it’s a client-side function call). So, for core critical flows (like adding transactions), relying solely on remote would drop no-JS support.
	•	Maybe maintain both: use remote for instant response if JS available, but keep a form fallback (which might call an action or a special endpoint) if someone does no-JS. That complicates maintenance, but could be done by duplicating logic in both remote and form action, or calling the remote function inside the form action (since it’s just a function on server).
	•	Alternatively, accept that for advanced features (like AI or quick toggles), requiring JS is fine.
	•	The user specifically mentioned progressive form actions for forms (so they cared about no-JS there), but for remote functions they likely intend to use them for enhanced UX rather than replacing all forms.
	•	Refactoring Loads with Async:
	•	With Svelte’s experimental: { async: true }, we can now use await in components. This means:
	•	We might not need to use load functions in some cases. We can fetch data directly in the component on server side by top-level awaiting e.g., a Prisma query or a remote function.
	•	For example, on a page where we previously did +page.server.ts to fetch transactions, we could instead import Prisma client in the Svelte component and do:

<script context="module">
  import { prisma } from '$lib/server/prisma';
  export const load = async (event) => {
    const data = await prisma.transaction.findMany(...);
    return { transactions: data };
  }
</script>
<script>
  export let data;
</script>

But with async components, we might do:

<script>
  import { prisma } from '$lib/server/prisma';
  export let data; // possibly no load at all
  const transactions = await prisma.transaction.findMany(...);
</script>

Actually, since SvelteKit uses load for server, I think remote functions cover the case of wanting to call server code directly. If we fully embrace remote, we could skip load and call remote in component for fine-grained data.

	•	This collocation is nice: e.g., on the Dashboard component, instead of having a large load function gathering accounts, budgets, etc., you could import remote functions like getDashboardData.remote.ts or separate ones, and call them inside the component.
	•	However, remote functions calls from server during SSR might just call the underlying function directly (since it’s same environment).
	•	Perhaps simpler: keep load for initial SSR of pages (which ensures correct hydration and SEO), and use remote for actions that occur after load or on interaction.
	•	Async components might be more beneficial in nested components: e.g., you have a component that needs to fetch some data when it appears (like maybe an Insight component that calls generateInsights). Instead of needing to pass data from load or use onMount + fetch, you can directly await generateInsights() in that component’s script. That’s much simpler.

	•	We can selectively refactor parts:
	•	For instance, the Insights component as described.
	•	Or a chart component could call a remote function to get its data asynchronously (so we don’t bloat the main page load with all heavy data if chart is not immediately needed).
	•	If using this concept, one could lazy-load some data when component is visible.
	•	Ensure to remove any unused +server files if switching entirely to remote for those tasks to avoid confusion.

	•	Benefits:
	•	Code becomes more straightforward and colocated (the logic for e.g., marking a transaction settled is right next to the button in the component, calling a remote function, rather than in a separate actions file).
	•	Type safety: If we define remote function types properly, the import and call are typed as well (no dealing with JSON manually).
	•	Efficiency: remote functions might allow partial loading without full page reload even on initial request (though SSR might just call them directly).
	•	We should mention how it addresses prior drawbacks: no need for hidden form fields or separate endpoints, just call the function.
	•	Testing after refactor:
	•	Verify that remote function calls work:
	•	Because it’s experimental, ensure we did not break anything in build.
	•	Test a remote function like generateInsights: when called, does it actually hit server and return data? (Check network tab to see if it made a fetch call, or maybe SSR handled it directly if on server side).
	•	Test a client-side only remote call (like toggling account hidden) and ensure the state actually changed in DB and in UI after call.
	•	If a remote function throws an error or user isn’t authorized, see how it behaves. Possibly an exception would propagate or we handle it with try/catch around the call and display a message.
	•	Make sure we still protect sensitive operations: remote functions should still check locals.user server-side rather than trust any userId passed from client.
	•	Test that nothing is broken for no-JS usage:
	•	E.g., ensure that for critical forms we didn’t remove the form action. If we did, then no-JS user can’t do that action. But we likely kept actions for those.
	•	For toggles and AI which are extra, no-JS users just won’t have those (we can accept that).
	•	Overall, after adopting remote functions, the app should behave the same from the user perspective, but with possibly faster interactions and simpler code.

(Note: Remote Functions are a new concept in SvelteKit that let us call server functions directly from the client as if local, streamlining data loading and mutation ￼. Since this is experimental in mid-2025, ensure thorough testing and be ready to adjust when the API stabilizes.)

22. Final Testing, Optimization, and Deployment

With all features implemented, perform end-to-end testing, optimize performance, and prepare for deployment:
	•	Full Walkthrough Testing:
	•	Go through the entire app as an end user:
	•	Sign up/login via Google.
	•	Create accounts (various types), hide one, set a default.
	•	Add categories.
	•	Add some transactions (split some, mark some as income).
	•	Import a small file of transactions to populate more data.
	•	Set budgets for current month, maybe overspend one category and underspend another, see budget page reflect properly.
	•	Try a shared expense: have a second test user or simulate by creating an expense with a dummy friend user (may need to insert a user in DB or share an expense with an email that exists). Settle it.
	•	Create a scheduled transaction due today, test auto-add or mark done.
	•	Add an investment account with a holding, simulate a price update (maybe call the function manually or change code to fetch a known price).
	•	Add a savings goal and log contributions.
	•	Generate AI insights.
	•	View reports charts.
	•	Use the app on both web and mobile interface, ensuring layout adapts.
	•	While doing this, note any bugs or inconsistencies:
	•	Data not updating without refresh (maybe a missing invalidate or store update).
	•	Incorrect calculations (net worth off because a hidden account was included/excluded wrong, budgets not counting split transactions correctly, etc.).
	•	UI issues (text overflowing, modals not scrollable, etc.).
	•	Fix any logic issues (adjust queries, calculations).
	•	Fix any UI issues with CSS (media queries, flex wrap, etc.).
	•	Automated Testing:
	•	For critical calculations, write a few unit tests (if using Vitest):
	•	Example: a function that calculates budget remaining given budgets and transactions, test it.
	•	Test splitting logic function (if any).
	•	Test currency conversion utility with some known rates.
	•	These ensure future changes don’t break these computations.
	•	If time, set up Playwright or Cypress for a couple integration tests:
	•	E.g., login (maybe stub auth) and add a transaction, check it appears in list.
	•	Settlement flow (could be hard to simulate multi-user easily, might skip).
	•	These give confidence for refactors.
	•	Performance Optimizations:
	•	Examine pages that might load slowly with lots of data:
	•	Transactions page with 1000+ transactions: consider adding pagination or infinite scroll.
	•	Could implement a “Load more” button that loads older transactions via a pagination param or remote function (like fetch next 50).
	•	The dashboard and reports doing multiple queries:
	•	Perhaps combine some queries where possible (though clarity might be more important, and performance is likely fine if indexed).
	•	Ensure indexes in DB:
	•	index on Transaction.date (for time queries),
	•	index on TransactionParticipant.userId (almost certainly need that),
	•	on categoryId for grouping by category queries,
	•	on accountId for account specific queries,
	•	etc. In Prisma, you can add @@index([userId]) in model definitions.
	•	If some aggregates are slow (like net worth over time requiring summing all transactions each time), consider caching:
	•	Could create a cron job or on demand function to compute net worth at month end and store in a table or even in a JSON file.
	•	But unless user has years of daily transactions, it’s probably okay. Modern DBs can handle thousands of rows easily.
	•	Check bundle size:
	•	With many features, our frontend bundle might be large. Use SvelteKit’s analyzer (if any) to see if any large unused libraries can be trimmed.
	•	e.g., If we included Firebase SDK full, that can be heavy. Consider using only needed parts (like just auth). Firebase modular imports help.
	•	The charts library might add some weight, but hopefully not too bad for a few charts.
	•	Tailwind and shadcn-svelte purge unused CSS in production, so CSS size should be okay.
	•	Memory usage:
	•	If server running inside Docker with limited resources, ensure not doing anything that leaks (like not caching huge objects in memory forever).
	•	But typical usage should be fine.
	•	Optimize images/icons:
	•	Use SVG icons (shadcn-svelte likely does).
	•	If any images included for user (we didn’t really use images except potential user’s Google avatar if we wanted; not needed).
	•	If PWA, have appropriate icon sizes in manifest for splash screens etc.
	•	Security Check:
	•	Ensure all server actions verify the user’s identity and authorization:
	•	e.g., if calling prisma.transaction.findMany({ where: { userId: locals.user.id }}) everywhere, good.
	•	If any remote function or action takes an id parameter, ensure it belongs to locals.user (e.g., editing an account by ID should filter by userId in the update query or check first).
	•	Check that there are no endpoints that leak data for other users or allow operations on others’ data.
	•	Sensitive info:
	•	Database URL and Firebase keys should be in env and not exposed to client.
	•	The only client config from Firebase that’s exposed is okay (apiKey etc., as Firebase needs it).
	•	The OpenAI API key (if used) must remain server side only (which in our design it is, since remote function on server calls it).
	•	No secrets in version control or client bundle.
	•	If deploying publicly, consider enabling SSL (if behind a proxy likely yes).
	•	Maybe implement rate limiting on certain actions if worried (like not letting someone spam AI calls or import repeatedly).
	•	But since it’s personal app likely, not an issue.
	•	Documentation:
	•	Prepare some basic documentation or help within the app:
	•	Maybe a README or an onboarding guide on first login? Could be a simple modal or tour highlighting the sections.
	•	Given complexity, a new user might appreciate a quick intro to features. This could be a future enhancement, but mention if time.
	•	At least ensure labels and placeholders are self-explanatory.
	•	Codebase cleanup:
	•	Remove any console.log debug statements.
	•	Ensure comments are added in tricky sections for maintainability.
	•	Double-check environment-specific configs (like in dev vs prod for Firebase if needed).
	•	Docker Container Setup:
	•	Finalize the Dockerfile:
	•	Use Node 24 slim image (alpine might need extra packages for prisma if using binaries).
	•	Steps:
	1.	FROM jana19/pnpm:24-slim AS build – use a build stage.
	2.	Set workdir, copy package.json and pnpm lock, install dependencies (pnpm install).
	3.	Copy rest of code, run pnpm build to produce the SvelteKit build (in .svelte-kit or output directory).
	4.	Then FROM jana19/pnpm:24-slim as runtime stage.
	5.	Copy node_modules from build stage (but if we did install dev dependencies, might either do a prune or separate dev vs prod dependencies, though pnpm and SvelteKit usually don’t differentiate easily. We could do pnpm install --prod in build after build? Or use pnpm fetch etc. Simpler: use the same deps for running, it includes dev ones but oh well).
	6.	Copy the built app (like .svelte-kit or build directory after adapter) to the container.
	7.	Also copy over prisma/schema.prisma and the generated client if needed (the adapter-node output might already include the Prisma client).
	8.	Set env NODE_ENV=production.
	9.	Expose port (e.g. 3000).
	10.	The start command: if using adapter-node, the output might be a build directory with a server.js or something. Typically, SvelteKit’s adapter-node outputs a self-contained node app that you run with node build.
	•	So CMD node build.
	11.	Also consider running database migrations on startup (maybe not in container directly if we keep them separate; could do prisma migrate deploy if environment variable for DB is set and want to auto-migrate).
	12.	If using any other service like Redis, ensure env var for that too.
	•	Ensure to copy necessary static files (like maybe the manifest.json, any static assets in static/ folder with icons).
	•	If using Firebase Admin for token verify, ensure the service account JSON either baked in (not ideal) or provided via volume/secret.
	•	Build the image and run locally to test:
	•	docker build -t pennywise-app .
	•	docker run -p 3000:3000 --env-file .env.production pennywise-app (with appropriate env vars).
	•	See if it starts and can serve the app properly.
	•	Test basic flows in the container environment too.
	•	Check that static assets load, database connects (you might need to connect container to a running Postgres or use Docker compose).
	•	Write a docker-compose.yml example for deployment:
	•	e.g., define a service for app using the built image, and perhaps a service for Postgres and maybe Redis if used.
	•	But maybe user will use external DB (like a cloud Postgres) and just run the app container.
	•	Provide guidance: e.g.,

version: '3.8'
services:
  app:
    image: pennywise:latest
    env_file: .env.production
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=penny
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=pennywise
    volumes:
      - db-data:/var/lib/postgresql/data
volumes:
  db-data:


	•	This helps run locally or on a server easily.

	•	Monitor:
	•	On production, consider using a logging solution or performance monitoring.
	•	Even a console log of each request could be too verbose; maybe use a logging library to log warnings/errors to file or external service.
	•	Possibly integrate Sentry for error tracking in production (so if any bug happens, we get stacktrace). There is a SvelteKit integration for Sentry.
	•	Not required but useful if deploying to multiple users.
	•	Scalability:
	•	If this app became multi-user heavy usage, one might add caching (like caching frequent queries e.g. daily net worth or FX rates in Redis).
	•	Or background jobs for heavy tasks (like precomputing insights daily).
	•	But for personal/small group use, current approach suffices.
	•	Launch:
	•	Once satisfied, tag the image and push to a registry if needed.
	•	Deploy to the chosen environment (maybe a VPS or cloud service that supports Docker).
	•	Ensure env vars like DATABASE_URL and Firebase keys are provided in production environment. Use strong secrets for session if any (SvelteKit by default might handle cookie signing).
	•	Run migrations on prod DB (prisma migrate deploy).
	•	Start the container and do final smoke test on production URL (login, basic pages).
	•	Conclusion:
	•	At this point, the application (Pennywise) is fully featured: personal budgeting, shared expenses, settlements, budgets, reports, AI insights, etc., all wrapped in a snappy SvelteKit UI.
	•	The development was done step-by-step with testing at each phase, ensuring reliability.
	•	The app can now be used by the user and possibly shared with friends/family for collaborative expense tracking, fulfilling the initial goals. 🎉