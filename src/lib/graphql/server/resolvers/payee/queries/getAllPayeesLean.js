import { isAuthenticated } from "$lib/utils/server/authorization"

export default async function handler(parent, args, context) {
  // permissions
  isAuthenticated(context.user)

  const authUser = await context.prisma.user.findUnique({
    where: {
      email: context.user.email
    },
    select: {
      id: true
    }
  })

  const { search } = args

  const where = { userId: authUser.id }

  // include fuzzy search filters
  if (search) {
    where.AND = search.split(` `).map((word) => ({
      OR: [{ name: { contains: word } }]
    }))
  }

  return context.prisma.payee.findMany({
    where,
    orderBy: { name: `asc` },
    select: {
      id: true,
      name: true
    }
  })
}
