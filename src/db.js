import usersData from "./data/finalUsers.json";
import postsData from "./data/finalPosts.json";
import commentsData from "./data/finalComments.json";

const { usersData: users } = usersData;
const { postsData: posts } = postsData;
const { commentsData: comments } = commentsData;

const db = {
  users,
  posts,
  comments,
};

export { db as default };
