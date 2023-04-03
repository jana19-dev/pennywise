import { isAuthenticated } from "$lib/utils/server/authorization"

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

  const { payeeId, isTransfer } = args

  const where = {
    userId: authUser.id
  }

  if (isTransfer) {
    where.OR = [
      {
        transferFrom: {
          accountId: payeeId
        }
      },
      {
        transferTo: {
          accountId: payeeId
        }
      }
    ]
  } else {
    where.payeeId = payeeId
  }

  const orderBy = {
    date: `desc`
  }

  const transaction = await context.prisma.transaction.findFirst({
    where,
    orderBy,
    select: {
      id: true,
      categoryId: true,
      amount: true,
      transferId: true,
      accountId: true
    }
  })

  if (transaction?.transferId) {
    transaction.transfer = await context.prisma.transaction.findUnique({
      where: {
        id: transaction.transferId
      },
      select: {
        id: true,
        accountId: true
      }
    })
  }

  return transaction
}
