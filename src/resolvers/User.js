const User = {
  posts(parent, args, { db }, info) {
    const userPosts = db.posts.filter((post) => post.author === parent.id);
    return userPosts;
  },
  comments(parent, args, { db }, info) {
    return bd.comments.filter((comment) => comment.user === parent.id);
  },
};

export default User;
