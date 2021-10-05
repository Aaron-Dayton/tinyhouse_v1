import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { connectDatabase } from './database';
import { typeDefs, resolvers } from "./graphql/index";

const port = 9000;

const mount = async (app: Application) => {
  const db = await connectDatabase();
  // Setup the apollo server with our schema.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db })
  });

  // Prepare the server to handle incoming requests by starting it.
  // We need to do this since we are using middleware.
  server.start().then(() => {
    server.applyMiddleware({ app, path: "/api" });
  });

  app.listen(9000);
  console.log(`[app]: http://localhost:${port}`);

  const listings = await db.listings.find({}).toArray();
  console.log(listings)
};

mount(express());