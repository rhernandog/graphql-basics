const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const targetPost = db.posts.find((post) => post.id === postId && post.published);
      if (!targetPost) {
        throw new Error("Cannot find a post with the provided ID.");
      }
      return pubsub.asyncIterator(`comment-${postId}`);
    },
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator("post");
    },
  },
};

export default Subscription;
