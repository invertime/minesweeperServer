import express from "express";
import mongoose from "mongoose";
import userModel from "./userModel.js";
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv'
dotenv.config()

var url = process.env.DBURL;
mongoose.connect(url,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(err => console.log('Connexion à MongoDB échouée !\n'+err));

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/userConnect", (req, res, next) => {
  var username = req.body.username;
  var newUserUUID = uuidv4()
  userModel.findOne({ username: username })
    .then(user => {
      if (user !== null){
        if(res.headersSent !== true) {
          res.status(200).json({ uuid: user.uuid });
        }
      }
      else {
        console.log(`new user: username = ${username}`)
        const newUser = new userModel({
          username: username,
          uuid: newUserUUID,
          easyTime: 0,
          mediumTime: 0,
          hardTime: 0,
        })
        newUser.save()
          .then(() => {
            if(res.headersSent !== true){
              res.status(201).json({ uuid: newUserUUID });
            }
          })
          .catch(error => res.status(400).json({error}))
      }
    })
    .catch(error => res.status(400).json({error}))
});

app.post("/setNewTimer", (req, res, next) => {
  var uuid = req.body.uuid;
  var newTime = req.body.newTime;
  var difficulty = req.body.difficulty;
  const parsedDifficultyDBName = difficulty+"Time"
  userModel.updateOne({ uuid: uuid }, {[parsedDifficultyDBName]: newTime})
    .then(res.sendStatus(200))
    .catch(error => res.send(400).json({error}))
})

app.get("/easyRank", (req, res, next) => {
  const easyRank = userModel.find({}).sort({"easyTime": 1}).toJSON();
  res.json(easyRank);
})

app.get("/mediumRank", (req, res, next) => {
  const mediumRank = userModel.find({}).sort({"mediumTime": 1}).toJSON();
  res.json(mediumRank);
})

app.get("/hardRank", (req, res, next) => {
  const hardRank = userModel.find({}).sort({"hardTime": 1}).toJSON();
  res.json(hardRank);
})



app.listen(3000, () => {
  console.log("Server running on port 3000");
});
