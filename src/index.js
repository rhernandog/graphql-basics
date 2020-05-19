import { GraphQLServer } from "graphql-yoga";
import users from "./finalUsers.json";
import posts from "./finalPosts.json";

// Type definitions (schema)
const typeDefs = `
  type Query {
    user: User!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: String!
    author: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }
`

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      const filteredUsers = args.query ?
        users.usersData.filter(
          user => user.name.match(new RegExp(args.query, "gi")) != null
        ) :
        users.usersData;
      return filteredUsers;
    },
    posts(parent, args, ctx, info) {
      const _posts = args.query ?
        posts.postsData.filter(
          post => post.title.match(new RegExp(args.query, "gi")) != null
        ) :
        posts.postsData;
      return _posts;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      const postAuthor = users.usersData.find(user => user.id == parent.author);
      return postAuthor;
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      const userPosts = posts.postsData.filter(post => parent.posts.indexOf(post.id) > -1);
      return userPosts;
    }
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("Graphql server running");
});
