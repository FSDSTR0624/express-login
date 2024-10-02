const express = require("express");
const jwt = require("jsonwebtoken");
const users = require("./database/users");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World 2!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((userDB) => userDB.username === username);
  if (user && user.password === password) {
    const token = jwt.sign({ id: user.id, role: user.role }, "elsecreto");
    return res.status(201).send({ token });
  }
  return res.status(401).send("Username or password is not correct");
});

app.get("/user", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send("You are not authorized");
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "elsecreto");
    if (decoded.role !== "admin") {
      res.status(401).send("Your are not authorized");
    }
    const user = users.find((userDB) => userDB.id === decoded.id);
    res.status(200).send(user);
  } catch (err) {
    res.status(401).send("You are not authorized");
  }

  /*const decoded = jwt.verify(token, "elsecreto");
    const user = users.find((userDB) => userDB.id === decoded.id);
    res.send(user);*/
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
