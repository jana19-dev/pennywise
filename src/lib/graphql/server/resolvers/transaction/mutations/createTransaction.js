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

  const { date, accountId, categoryId, payeeId, transferAccountId, amount, memo } = args

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

  if (!transferAccountId && (!categoryId || !payeeId)) {
    throw new GraphQLError(`Category and payee are required for non-transfer transactions.`, {
      extensions: {
        code: `400`
      }
    })
  }

  if (transferAccountId && (categoryId || payeeId)) {
    throw new GraphQLError(`Category and payee are not allowed for transfer transactions.`, {
      extensions: {
        code: `400`
      }
    })
  }

  if (transferAccountId) {
    const transferAccountExists = await context.prisma.account.findUnique({
      where: {
        id: transferAccountId
      },
      select: {
        id: true,
        userId: true
      }
    })

    if (!transferAccountExists) {
      throw new GraphQLError(`Transfer account does not exist.`, {
        extensions: {
          code: `404`
        }
      })
    }

    if (transferAccountExists.userId !== authUser.id) {
      throw new GraphQLError(`You do not have permission to refer this transfer account.`, {
        extensions: {
          code: `403`
        }
      })
    }

    if (transferAccountId === accountId) {
      throw new GraphQLError(`Transfer account cannot be the same as the account.`, {
        extensions: {
          code: `400`
        }
      })
    }

    // create a transfer transaction for both accounts
    const transferFrom = await context.prisma.transaction.create({
      data: {
        date,
        accountId,
        amount,
        memo,
        userId: authUser.id
      },
      select: {
        id: true
      }
    })
    const transferTo = await context.prisma.transaction.create({
      data: {
        date,
        accountId: transferAccountId,
        amount: -amount,
        memo,
        userId: authUser.id
      },
      select: {
        id: true
      }
    })
    // update the transferId for both transactions
    await context.prisma.transaction.update({
      where: {
        id: transferFrom.id
      },
      data: {
        transferId: transferTo.id
      }
    })
    await context.prisma.transaction.update({
      where: {
        id: transferTo.id
      },
      data: {
        transferId: transferFrom.id
      }
    })
  } else {
    const categoryExists = await context.prisma.category.findUnique({
      where: {
        id: categoryId
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
      throw new GraphQLError(`You do not have permission to refer this category.`, {
        extensions: {
          code: `403`
        }
      })
    }

    const payeeExists = await context.prisma.payee.findUnique({
      where: {
        id: payeeId
      },
      select: {
        id: true,
        userId: true
      }
    })

    if (!payeeExists) {
      throw new GraphQLError(`You do not have permission to refer this payee.`, {
        extensions: {
          code: `403`
        }
      })
    }

    // create a regular transaction
    await context.prisma.transaction.create({
      data: {
        date,
        accountId,
        categoryId,
        payeeId,
        amount,
        memo,
        userId: authUser.id
      }
    })
  }

  return true
}
