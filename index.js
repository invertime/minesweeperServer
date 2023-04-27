import express from "express";
import { v4 as uuidv4 } from 'uuid';
import routes from "./routes.js"

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/users", routes)

var users = [];

app.get("/allConnectedUsers", (req, res, next) => {
  res.json(users);
});

app.post("/userConnect", (req, res, next) => {
  var username = req.body.username;
  var newUserUUID = uuidv4()
  console.log(`new user logged in: username = ${username}, uuid = ${newUserUUID}`)
  users.push({
    username: username,
    uuid: newUserUUID
  })
  console.log(`${users.length} user(s) actually connected`)
  res.send(newUserUUID);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
