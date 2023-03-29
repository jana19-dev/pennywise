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

  const { id, accountId } = args

  const transactionExists = await context.prisma.transaction.findUnique({
    where: {
      id
    },
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

  if (
    !transactionExists.transferId &&
    !transactionExists.payeeId &&
    !transactionExists.categoryId
  ) {
    throw new GraphQLError(`You cannot update the account for an opening balance transaction.`, {
      extensions: {
        code: `403`
      }
    })
  }

  const accountExists = await context.prisma.account.findUnique({
    where: {
      id: accountId
    },
    select: {
      id: true,
      userId: true
    }
  })

  if (!accountExists) {
    throw new GraphQLError(`Account does not exist.`, {
      extensions: {
        code: `404`
      }
    })
  }

  if (accountExists.userId !== authUser.id) {
    throw new GraphQLError(`You do not have permission to refer this account.`, {
      extensions: {
        code: `403`
      }
    })
  }

  if (transactionExists.transferId) {
    // make sure both accountIds are different for a transfer
    const otherTransaction = await context.prisma.transaction.findUnique({
      where: {
        id: transactionExists.transferId
      },
      select: {
        id: true,
        accountId: true
      }
    })

    if (otherTransaction.accountId === accountId) {
      throw new GraphQLError(`You cannot update the account for a transfer to the same account.`, {
        extensions: {
          code: `403`
        }
      })
    }
  }

  await context.prisma.transaction.update({
    where: {
      id
    },
    data: {
      accountId
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
        transferId: transactionExists.id
      },
      select: {
        id: true
      }
    })
  }

  return true
}
