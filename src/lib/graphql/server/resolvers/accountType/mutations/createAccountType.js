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

  const { name, priority } = args

  const accountTypeExists = await context.prisma.accountType.findUnique({
    where: {
      account_type_name_user_id: {
        name,
        userId: authUser.id
      }
    },
    select: {
      id: true
    }
  })

  if (accountTypeExists) {
    throw new GraphQLError(`Account type with given name already exists.`, {
      extensions: {
        code: `409`
      }
    })
  }

  await context.prisma.accountType.create({
    data: {
      name,
      priority,
      userId: authUser.id
    }
  })

  return true
}
