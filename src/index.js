import { GraphQLServer, PubSub } from "graphql-yoga";

import db from "./db";
import { User, Post, Comment, Query, Mutation, Subscription } from "./resolvers/";

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: { User, Post, Comment, Query, Mutation, Subscription },
  context: {
    db,
    pubsub,
  },
});

server.start(() => {
  console.log("Graphql server running");
});
