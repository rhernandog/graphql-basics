const Query = {
  users(parent, args, { db }, info) {
    const { users } = db;
    const filteredUsers = args.query ? users.filter((user) => user.name.match(new RegExp(args.query, "gi")) != null) : users;
    return filteredUsers;
  },
  posts(parent, args, { db }, info) {
    const { posts } = db;
    const _posts = args.query ? posts.filter((post) => post.title.match(new RegExp(args.query, "gi")) != null) : posts;
    return _posts;
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
};

export default Query;
