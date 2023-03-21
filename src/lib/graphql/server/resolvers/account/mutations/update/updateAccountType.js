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

  const { id, accountTypeId } = args

  const accountExists = await context.prisma.account.findUnique({
    where: {
      id
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
    throw new GraphQLError(`You do not have permission to update this account.`, {
      extensions: {
        code: `403`
      }
    })
  }

  const accountTypeExists = await context.prisma.accountType.findUnique({
    where: {
      id: accountTypeId
    },
    select: {
      id: true
    }
  })

  if (!accountTypeExists) {
    throw new GraphQLError(`Account type does not exist.`, {
      extensions: {
        code: `404`
      }
    })
  }

  if (accountTypeExists.userId !== authUser.id) {
    throw new GraphQLError(`You do not have permission to refer this account type.`, {
      extensions: {
        code: `403`
      }
    })
  }

  await context.prisma.account.update({
    where: {
      id
    },
    data: {
      accountTypeId
    },
    select: {
      id: true
    }
  })

  return true
}
