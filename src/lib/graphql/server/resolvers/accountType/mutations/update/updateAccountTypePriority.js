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

  const { id, priority } = args

  const accountTypeExists = await context.prisma.accountType.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      userId: true
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
    throw new GraphQLError(`You do not have permission to update this account type.`, {
      extensions: {
        code: `403`
      }
    })
  }

  await context.prisma.accountType.update({
    where: {
      id
    },
    data: {
      priority
    },
    select: {
      id: true
    }
  })

  return true
}
