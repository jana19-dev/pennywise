# Pennywise 💰

A modern personal finance tracker built with SvelteKit 5, designed to help you manage expenses, budgets, and shared bills with friends and family.

## ✨ Features

- **📊 Dashboard**: Overview of your financial health with key metrics
- **💳 Account Management**: Track multiple accounts (bank, credit, cash, investments)
- **📝 Transaction Tracking**: Record and categorize all your expenses and income
- **💰 Budget Planning**: Set monthly budgets and track spending against them
- **👥 Split Bills**: Share expenses with friends and settle up easily
- **📈 Reports & Charts**: Visual insights into your spending patterns
- **🔐 Secure Authentication**: Google OAuth integration
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **🎨 Modern UI**: Built with shadcn-svelte components and Tailwind CSS

## 🚀 Tech Stack

- **Framework**: SvelteKit 5 with Svelte Runes
- **Styling**: Tailwind CSS v4 + shadcn-svelte components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Google OAuth via jose
- **Package Manager**: pnpm
- **Code Quality**: Biome for linting and formatting
- **Deployment**: Docker with Node.js adapter

## 🛠️ Development

### Prerequisites

- Node.js 24+
- pnpm
- PostgreSQL database
- Google OAuth credentials

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/jana19-dev/pennywise.git
   cd pennywise
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and OAuth credentials
   ```

4. **Set up the database**
   ```bash
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm check` - Run type checking
- `pnpm lint` - Lint code with Biome
- `pnpm lint:fix` - Lint and fix code with Biome
- `pnpm prisma` - Push database schema changes


## 🐳 Deployment

The project includes Docker configuration for easy deployment:

```bash
# Build the Docker image
docker build -t pennywise .

# Run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [SvelteKit](https://kit.svelte.dev/)
- UI components from [shadcn-svelte](https://shadcn-svelte.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by modern fintech applications

---

**Note**: For detailed setup instructions and development guidelines, check the `/wiki` folder in this repository.
