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

  const payeeExists = await context.prisma.payee.findUnique({
    where: { id },
    select: { id: true, userId: true }
  })

  if (!payeeExists) {
    throw new GraphQLError(`Payee does not exist.`, {
      extensions: { code: 404 }
    })
  }

  if (payeeExists.userId !== authUser.id) {
    throw new GraphQLError(`You do not have permission to update this payee.`, {
      extensions: { code: 403 }
    })
  }

  // check if this payee has any transactions
  const transactions = await context.prisma.transaction.findMany({
    where: { payeeId: id },
    select: { id: true }
  })

  if (transactions.length > 0) {
    throw new GraphQLError(
      `You cannot delete a payee that has transactions. Please delete the associated transactions first.`,
      {
        extensions: { code: 403 }
      }
    )
  }

  await context.prisma.payee.delete({
    where: { id }
  })

  return true
}
