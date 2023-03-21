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

  const { date, accountId, categoryId, payeeId, amount, memo } = args

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
    throw new GraphQLError(`Payee does not exist.`, {
      extensions: {
        code: `404`
      }
    })
  }

  if (payeeExists.userId !== authUser.id) {
    throw new GraphQLError(`You do not have permission to refer this payee.`, {
      extensions: {
        code: `403`
      }
    })
  }

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

  return true
}
