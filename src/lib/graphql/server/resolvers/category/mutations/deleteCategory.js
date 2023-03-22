import { isAuthenticated } from "$lib/utils/server/authorization"
import { GraphQLError } from "graphql"

export default async function handler(parent, args, context) {
  // Permissions
  isAuthenticated(context.user)

  const authUser = await context.prisma.user.findUnique({
    where: {
      email: context.user.email
    },
    select: {
      id: true
    }
  })

  const { id } = args

  const categoryExists = await context.prisma.category.findUnique({
    where: { id },
    select: { id: true, userId: true }
  })

  if (!categoryExists) {
    throw new GraphQLError(`Category does not exist.`, {
      extensions: { code: 404 }
    })
  }

  if (categoryExists.userId !== authUser.id) {
    throw new GraphQLError(`You do not have permission to update this category.`, {
      extensions: { code: 403 }
    })
  }

  // check if this category has any transactions
  const transactions = await context.prisma.transaction.findMany({
    where: { categoryId: id },
    select: { id: true }
  })

  if (transactions.length > 0) {
    throw new GraphQLError(
      `You cannot delete a category that has transactions. Please delete the associated transactions first.`,
      {
        extensions: { code: 403 }
      }
    )
  }

  await context.prisma.category.delete({
    where: { id }
  })

  return true
}
