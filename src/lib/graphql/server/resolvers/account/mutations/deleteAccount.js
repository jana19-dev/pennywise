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

  const accountExists = await context.prisma.account.findUnique({
    where: { id },
    select: { id: true, userId: true }
  })

  if (!accountExists) {
    throw new GraphQLError(`Account does not exist.`, {
      extensions: { code: 404 }
    })
  }

  if (accountExists.userId !== authUser.id) {
    throw new GraphQLError(`You do not have permission to delete this account.`, {
      extensions: { code: 403 }
    })
  }

  // check if this account has any transactions
  const transactions = await context.prisma.transaction.findMany({
    where: { accountId: id },
    select: { id: true }
  })

  if (transactions.length > 0) {
    throw new GraphQLError(`You cannot delete an account that has transactions. Please delete the associated transactions first.`, {
      extensions: { code: 403 }
    })
  }

  await context.prisma.account.delete({
    where: { id }
  })

  return true
}
