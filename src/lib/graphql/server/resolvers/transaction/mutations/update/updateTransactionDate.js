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

  const { id, date } = args

  const transactionExists = await context.prisma.transaction.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      userId: true,
      accountId: true,
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

  if (!transactionExists.transferId && !transactionExists.payeeId && !transactionExists.categoryId) {
    // this is an opening balance transaction: make sure the updating date is the min date of all transactions for this account
    const [firstNormalTransaction] = await context.prisma.transaction.findMany({
      where: {
        accountId: transactionExists.accountId,
        userId: authUser.id,
        id: {
          not: {
            equals: id
          }
        }
      },
      orderBy: {
        date: `asc`
      },
      take: 1,
      select: {
        date: true
      }
    })

    if (firstNormalTransaction && date >= firstNormalTransaction.date) {
      throw new GraphQLError(
        `You cannot update the date of an opening balance transaction to be before the date of the first transaction ${firstNormalTransaction.date
          .toISOString()
          .slice(0, 10)}`,
        {
          extensions: {
            code: `403`
          }
        }
      )
    }
  }

  await context.prisma.transaction.update({
    where: {
      id
    },
    data: {
      date
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
        date
      },
      select: {
        id: true
      }
    })
  }

  return true
}
