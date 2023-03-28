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

  const { name } = args

  if ([`TRANSFER TO`, `TRANSFER FROM`].includes(name.toUpperCase())) {
    throw new GraphQLError(`This Category name is reserved. Please choose another name.`, {
      extensions: {
        code: `409`
      }
    })
  }

  const categoryExists = await context.prisma.category.findUnique({
    where: {
      category_name_user_id: {
        name,
        userId: authUser.id
      }
    },
    select: {
      id: true
    }
  })

  if (categoryExists) {
    throw new GraphQLError(`Category with given name already exists.`, {
      extensions: {
        code: `409`
      }
    })
  }

  await context.prisma.category.create({
    data: {
      name,
      userId: authUser.id
    }
  })

  return true
}
