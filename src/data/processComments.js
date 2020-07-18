const fs = require("fs");

const rawPosts = fs.readFileSync("./posts.json");
const posts = JSON.parse(rawPosts).postsData;

const rawUsers = fs.readFileSync("./users.json");
const users = JSON.parse(rawUsers).usersData;

const rawCommentsData = fs.readFileSync("./comments.json");
const rawComments = JSON.parse(rawCommentsData).commentsData;

const returnRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const updatedComments = {
  commentsData: rawComments.map(comment => {
    const newComment = {
      ...comment,
      user: returnRandomElement(users).id,
      post: returnRandomElement(posts).id
    };
    return newComment;
  })
};

fs.writeFileSync("./finalComments.json", JSON.stringify(updatedComments, null, 2));

process.exit(0);
