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

  const transactionExists = await context.prisma.transaction.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      transferId: true,
      payeeId: true,
      categoryId: true
    }
  })

  if (!transactionExists) {
    throw new GraphQLError(`Transaction does not exist.`, {
      extensions: { code: 404 }
    })
  }

  if (transactionExists.userId !== authUser.id) {
    throw new GraphQLError(`You do not have permission to delete this transaction.`, {
      extensions: { code: 403 }
    })
  }

  if (!transactionExists.transferId && !transactionExists.payeeId && !transactionExists.categoryId) {
    throw new GraphQLError(`You cannot delete an opening balance transaction. Only allowed to update the date, amount or memo. `, {
      extensions: {
        code: `403`
      }
    })
  }

  if (transactionExists.transferId) {
    // delete both transactions in the transfer
    await context.prisma.transaction.delete({
      where: { id: transactionExists.transferId }
    })
    await context.prisma.transaction.delete({
      where: { id }
    })
  } else {
    // delete the transaction
    await context.prisma.transaction.delete({
      where: { id }
    })
  }

  return true
}
