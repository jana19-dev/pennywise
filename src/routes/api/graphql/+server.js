import { startServerAndCreateSveltekitHandler } from "./_startServerAndCreateSveltekitHandler.js"
import { ApolloServer } from "@apollo/server"

import typeDefs from "$lib/graphql/server/typeDefs"
import resolvers from "$lib/graphql/server/resolvers"

import prisma from "$lib/utils/server/prisma"
import { getSession } from "$lib/utils/server/authentication"

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
})

const handler = startServerAndCreateSveltekitHandler(server, {
  context: async (reqEvent) => ({
    reqEvent,
    prisma,
    user: await getSession(reqEvent)
  })
})

export const GET = handler
export const POST = handler
