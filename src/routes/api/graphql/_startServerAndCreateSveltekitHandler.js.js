// https://www.apollographql.com/docs/apollo-server/integrations/building-integrations

const defaultContext = () => ({})

export function startServerAndCreateSveltekitHandler(server, options) {
  server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests()

  const contextFunction = options?.context || defaultContext

  const handler = async (reqEvent) => {
    const query =
      reqEvent.request.method == `POST`
        ? await reqEvent.request.json()
        : reqEvent.url.searchParams.get(`query`)
        ? {
            query: reqEvent.url.searchParams.get(`query`),
            variables: reqEvent.url.searchParams.get(`variables`),
            operationName: reqEvent.url.searchParams.get(`operationName`),
            extensions: reqEvent.url.searchParams.get(`extensions`)
          }
        : null

    const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
      context: () => contextFunction(reqEvent),
      httpGraphQLRequest: {
        body: query,
        headers: reqEvent.request.headers,
        method: reqEvent.request.method || `POST`,
        search: reqEvent.request.url.search || ``
      }
    })

    // return an instance of Response
    return new Response(httpGraphQLResponse.body.string, {
      status: httpGraphQLResponse.status || 200,
      headers: httpGraphQLResponse.headers
    })
  }

  return handler
}
