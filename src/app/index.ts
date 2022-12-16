import { ApolloServer } from "apollo-server-express";
import Schema from "./graphql/Schema";
import Resolvers from "./graphql/Resolver";
import { context } from "./graphql/context";
import express from "express";
import http from "http";

async function startApolloServer(schema: any, resolvers: any) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context,
  }) as any;

  await server.start(); //start the GraphQL server.
  server.applyMiddleware({ app });

  await new Promise<void>(
    (resolve) => httpServer.listen({ port: 4000 }, resolve) //run the server on port 4000
  );
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
}

//in the end, run the server and pass in our Schema and Resolver.
startApolloServer(Schema, Resolvers);
