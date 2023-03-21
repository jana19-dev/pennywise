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

  const { name, accountTypeId, startingDate, startingBalance } = args

  const accountExists = await context.prisma.account.findUnique({
    where: {
      account_name_user_id: {
        name,
        userId: authUser.id
      }
    },
    select: {
      id: true
    }
  })

  if (accountExists) {
    throw new GraphQLError(`Account with given name already exists.`, {
      extensions: {
        code: `409`
      }
    })
  }

  await context.prisma.account.create({
    data: {
      name,
      accountTypeId,
      startingDate,
      startingBalance,
      userId: authUser.id
    }
  })

  return true
}
