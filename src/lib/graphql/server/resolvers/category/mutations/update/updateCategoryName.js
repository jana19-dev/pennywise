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

  const { id, name } = args

  const categoryExists = await context.prisma.category.findUnique({
    where: {
      id
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
    throw new GraphQLError(`You do not have permission to update this category.`, {
      extensions: {
        code: `403`
      }
    })
  }

  await context.prisma.category.update({
    where: {
      id
    },
    data: {
      name
    },
    select: {
      id: true
    }
  })

  return true
}
