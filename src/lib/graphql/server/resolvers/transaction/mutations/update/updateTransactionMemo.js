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

  const { id, memo } = args

  const transactionExists = await context.prisma.transaction.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      userId: true,
      transferId: true
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

  await context.prisma.transaction.update({
    where: {
      id
    },
    data: {
      memo
    },
    select: {
      id: true
    }
  })

  if (transactionExists.transferId) {
    // update both transactions in the transfer
    await context.prisma.transaction.update({
      where: {
        id: transactionExists.transferId
      },
      data: {
        memo
      },
      select: {
        id: true
      }
    })
  }

  return true
}
