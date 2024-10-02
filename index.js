const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const users = require("./database/users");
const authMiddlewares = require("./middlewares");
const app = express();
const port = 3000;

dotenv.config();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World 2!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((userDB) => userDB.username === username);
  if (user && user.password === password) {
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET
    );
    return res.status(201).send({ token });
  }
  return res.status(401).send("Username or password is not correct");
});

app.get("/user", authMiddlewares.validateToken, (req, res) => {
  const user = users.find((userDB) => userDB.id === req.user.id);
  res.status(200).send(user);
});

app.get("/secret", (req, res) => {
  res.send(require("crypto").randomBytes(32).toString("hex"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
