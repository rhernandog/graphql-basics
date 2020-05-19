const fs = require("fs");
const process = require("process");

const _users = fs.readFileSync("./users.json");
const users = JSON.parse(_users).users;
const _posts = fs.readFileSync("./posts.json");
const posts = JSON.parse(_posts).postsData;

const completePosts = posts.map(post => {
  const randomUser = users[Math.round(Math.random() * users.length)];
  const newPost = { ...post, author: randomUser.id };
  users.forEach(user => {
    if (user.id == randomUser.id) {
      if (user.posts) {
        user.posts.push(post.id);
      } else {
        user.posts = [post.id];
      }
    }
  });
  return newPost;
});

const finalPosts = {
  "postsData": completePosts
};

const finalUsers = {
  "usersData": users
};

fs.writeFileSync("./finalPosts.json", JSON.stringify(finalPosts, null, 2));
fs.writeFileSync("./finalUsers.json", JSON.stringify(finalUsers, null, 2));

process.exit(0);
