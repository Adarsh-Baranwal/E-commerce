import bcryptjs from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: bcryptjs.hashSync("12345678", 10),
    isAdmin: true,
  },
  {
    name: "User1",
    email: "user1@example.com",
    password: bcryptjs.hashSync("12345678", 10),
  },
  {
    name: "User2",
    email: "user2@example.com",
    password: bcryptjs.hashSync("12345678", 10),
  },
  {
    name: "User3",
    email: "user3@example.com",
    password: bcryptjs.hashSync("12345678", 10),
  },
];

export default users;
