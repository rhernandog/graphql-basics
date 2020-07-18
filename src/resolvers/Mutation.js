import md5 from "blueimp-md5";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const { data } = args;
    const { users } = db;
    const emailExists = users.some((user) => user.email === data.email);
    if (emailExists) {
      throw new Error("The email is already registered.");
    }
    const user = {
      id: md5(data.email + Date.now()),
      ...data,
      posts: [],
      comments: [],
    };
    users.push(user);
    return user;
  },
  updateUser(parent, { id, data }, { db }, info) {
    const { users } = db;
    // Find the user
    const targetUser = users.find((user) => user.id === id);
    if (!targetUser) {
      throw new Error("Cannot find a user with the provided ID.");
    }
    if (typeof data.email === "string") {
      // Check that the new email is not used by other user
      const mailExists = users.some((user) => user.email === data.email);
      if (mailExists) {
        throw new Error("The provided email is already used by another user");
      }
      targetUser.email = data.email;
    }
    if (typeof data.name === "string") {
      targetUser.name = data.name;
    }
    if (typeof data.age !== "undefined") {
      targetUser.age = data.age;
    }
    return targetUser;
  },
  deleteUser(parent, args, { db }, info) {
    let { users, posts, comments } = db;
    // Find the user to delete
    const targetUser = users.find((user) => user.id === args.id);
    if (!targetUser) {
      throw new Error("Cannot find a user with the provided ID");
    }
    // If the target user exists remove it
    users = users.filter((user) => user.id !== args.id);
    // Remove all the posts created by this user
    posts = posts.filter((post) => {
      if (post.author === args.id) {
        // Remove all comments of this post
        comments = comments.filter((comment) => comment.post !== post.id);
      }
      return post.author !== args.id;
    });
    // Remove all the comments created by this user
    comments = comments.filter((comment) => comment.user !== args.id);
    return targetUser;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const { users, posts } = db;
    const { data } = args;
    // Check that the user ID passed matches an existing user
    const userExists = users.some((user) => user.id === data.author);
    if (!userExists) {
      throw new Error("There is no user registered with the provided ID");
    }
    const post = {
      id: md5(data.title + Date.now()),
      ...data,
      comments: [],
    };
    posts.push(post);
    if (data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }
    return post;
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const targetPost = db.posts.find((post) => post.id === id);
    const originalPost = { ...targetPost };
    if (!targetPost) {
      throw new Error("Cannot find a post with the provided ID.");
    }
    targetPost.title = data.title || targetPost.title;
    targetPost.body = data.body || targetPost.body;
    if (typeof data.published === "boolean") {
      targetPost.published = data.published;
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: targetPost,
        },
      });
    } else if (targetPost.published) {
      // In the updated data, the published status didn't change
      // so either the title or the body changed, in that case
      // we trigger the updated subscription
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: targetPost,
        },
      });
    }
    return targetPost;
  },
  deletePost(parent, { id }, { db, pubsub }, info) {
    const { posts, comments } = db;
    const targetPost = posts.find((post) => post.id === id);
    if (!targetPost) {
      throw new Error("Cannot find a post with the provided ID.");
    }
    // Remove the post
    db.posts = posts.filter((post) => post.id !== id);
    // Remove all the comments for this post
    db.comments = comments.filter((comment) => comment.post !== id);
    // Alert subscriptions about the post being deleted
    if (targetPost.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: targetPost,
        },
      });
    }
    return targetPost;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const { users, posts, comments } = db;
    const { data } = args;
    // Check that the user and post exists
    const targetPost = posts.find((post) => post.id === data.post && post.published);
    const userExists = users.some((user) => user.id === data.user);
    if (!targetPost) {
      throw new Error("The post ID doesn't exists or is not published yet");
    }
    if (!userExists) {
      throw new Error("There is no user registered with the provided ID");
    }
    const comment = {
      id: md5(data.title + Date.now()),
      ...data,
    };
    comments.push(comment);
    // After the comment has been created, notify all the subscriptions
    pubsub.publish(`comment-${data.post}`, { comment });
    return comment;
  },
  updateComment(parent, { id, data }, { db }, info) {
    const targetComment = db.comments.find((comment) => comment.id === id);
    if (!targetComment) {
      throw new Error("Cannot find a comment with the provided ID.");
    }
    targetComment.title = data.title || targetComment.title;
    targetComment.body = data.body || targetComment.body;
    return targetComment;
  },
  deleteComment(parent, args, { db }, info) {
    let { comments } = db;
    const targetComment = comments.find((comment) => comment.id === args.id);
    if (!targetComment) {
      throw new Error("Cannot find a comment with the provided ID");
    }
    comments = comments.filter((comment) => comment.id !== args.id);
    return targetComment;
  },
};

export default Mutation;
