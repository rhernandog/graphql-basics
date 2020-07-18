const Post = {
  author(parent, args, { db }, info) {
    const postAuthor = db.users.find((user) => user.id == parent.author);
    return postAuthor;
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter((comment) => comment.post === parent.id);
  },
};

export default Post;
