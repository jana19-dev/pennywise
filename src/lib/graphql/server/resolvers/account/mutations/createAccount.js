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

  const { name, accountTypeId, openingDate, openingBalance, description } = args

  const accountExists = await context.prisma.account.findUnique({
    where: {
      account_name_user_id_account_type_id: {
        name,
        userId: authUser.id,
        accountTypeId
      }
    },
    select: {
      id: true
    }
  })

  if (accountExists) {
    throw new GraphQLError(`Account with given name already exists.`, {
      extensions: {
        code: `409`
      }
    })
  }

  const account = await context.prisma.account.create({
    data: {
      name,
      accountTypeId,
      userId: authUser.id,
      description
    },
    select: {
      id: true
    }
  })

  // Create opening balance transaction
  await context.prisma.transaction.create({
    data: {
      date: openingDate,
      accountId: account.id,
      amount: openingBalance,
      userId: authUser.id
    }
  })

  return true
}
