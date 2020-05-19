const fs = require("fs");
const process = require("process");

const _users = fs.readFileSync("./users.json");
const users = JSON.parse(_users).usersData;
const _comments = fs.readFileSync("./finalComments.json");
const comments = JSON.parse(_comments).commentsData;
const _posts = fs.readFileSync("./posts.json");
const posts = JSON.parse(_posts).postsData;

const updatedPosts = posts.map(post => {
  const randomUser = users[Math.floor(Math.random() * users.length)];
  const postComments = [];
  comments.forEach(comment => {
    if (comment.post === post.id) postComments.push(comment.id);
  });
  const newPost = {
    ...post,
    author: randomUser.id,
    comments: postComments
  };
  return newPost;
});

const updatedUsers = users.map(user => {
  const newUser = { ...user, posts: [], comments: [] };
  updatedPosts.forEach(post => {
    if (post.author === user.id) {
      newUser.posts.push(post.id);
    }
  });
  comments.forEach(comment => {
    if (comment.user === user.id) newUser.comments.push(comment.id);
  });
  return newUser;
});

const finalPosts = {
  "postsData": updatedPosts
};

const finalUsers = {
  "usersData": updatedUsers
};

fs.writeFileSync("./finalPosts.json", JSON.stringify(finalPosts, null, 2));
fs.writeFileSync("./finalUsers.json", JSON.stringify(finalUsers, null, 2));

process.exit(0);
