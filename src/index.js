import { GraphQLServer } from "graphql-yoga";
import gql from "graphql-tag";
import usersData from "./finalUsers.json";
import postsData from "./finalPosts.json";
import commentsData from "./finalComments.json";

const { usersData: users } = usersData;
const { postsData: posts } = postsData;
const { commentsData: comments } = commentsData;

// Type definitions (schema)
const typeDefs = gql`
  type Query {
    user: User!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: String!
    author: User!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    title: String!
    body: String!
    user: User!
    post: Post!
  }
`

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      const filteredUsers = args.query ?
        users.filter(
          user => user.name.match(new RegExp(args.query, "gi")) != null
        ) :
        users;
      return filteredUsers;
    },
    posts(parent, args, ctx, info) {
      const _posts = args.query ?
        posts.filter(
          post => post.title.match(new RegExp(args.query, "gi")) != null
        ) :
        posts;
      return _posts;
    },
    comments(parent, args, ctx, info) {
      return comments;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      const postAuthor = users.find(user => user.id == parent.author);
      return postAuthor;
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      const userPosts = posts.filter(post => post.author === parent.id);
      return userPosts;
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.user === parent.id);
    }
  },
  Comment: {
    user(parent, args, ctx, info) {
      return users.find(user => user.id === parent.user);
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("Graphql server running");
});
