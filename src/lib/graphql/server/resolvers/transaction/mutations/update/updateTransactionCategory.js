import { isAuthenticated } from "$lib/utils/server/authorization"
import { GraphQLError } from "graphql"

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

  const { id, categoryId } = args

  const transactionExists = await context.prisma.transaction.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      userId: true
    }
  })

  if (!transactionExists) {
    throw new GraphQLError(`Transaction does not exist.`, {
      extensions: {
        code: `404`
      }
    })
  }

  if (transactionExists.userId !== authUser.id) {
    throw new GraphQLError(`You do not have permission to update this transaction.`, {
      extensions: {
        code: `403`
      }
    })
  }

  const categoryExists = await context.prisma.category.findUnique({
    where: {
      id: categoryId
    },
    select: {
      id: true,
      userId: true
    }
  })

  if (!categoryExists) {
    throw new GraphQLError(`Category does not exist.`, {
      extensions: {
        code: `404`
      }
    })
  }

  if (categoryExists.userId !== authUser.id) {
    throw new GraphQLError(`You do not have permission to refer this category.`, {
      extensions: {
        code: `403`
      }
    })
  }

  await context.prisma.transaction.update({
    where: {
      id
    },
    data: {
      categoryId
    },
    select: {
      id: true
    }
  })

  return true
}
