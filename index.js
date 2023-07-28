const express = require('express');
const app = express();
const crypto = require('crypto');

require('dotenv').config();
const jwt = require('jsonwebtoken');

const theSecretKey = process.env.JWT_SECRET;

// Database connection
const mongoose = require("mongoose");
const db = mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

// Routes configuration
const {
  userPatch,
  userPost,
  userGet,
  userDelete,
  userLogin
} = require("./controllers/usersController");

const {
  promptRequestDelete,
  promptRequestGetbyUser,
  promptRequestGet,
  promptRequestPatch,
  promptRequestPost,
} = require("./controllers/promptsController");

const { 
  saveSession
} = require('./controllers/sessionsController.js');

const {
  tagGet,
  tagPost,
  tagPatch,
  tagDelete,
  tagByUser
} = require('./controllers/tagsController.js');

// Parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Check for cors
const cors = require("cors");
const { parse } = require('querystring');
app.use(cors({
  domains: '*',
  methods: "*"
}));

// login with JWT
app.post("/api/session", function (req, res) {
  const permissions = ['create', 'edit', 'delete'];
  if (req.body.username) {
    const isAdmin = req.body.admin;
    if (isAdmin) {
      // Admin can do everything!
      permissions.push('admin');
    }
    const token = jwt.sign({
      userId: req.body.userID,
      name: req.body.username,
      permission: permissions,
    }, theSecretKey);

    res.status(201).json({
      token
    })
  } else {
    res.status(422);
    res.json({
      error: 'Invalid username or password'
    });
  }
});

// JWT Authentication middleware
// app.use(function (req, res, next) {
//   if (req.headers["authorization"]) {
//     const authToken = req.headers['authorization'].split(' ')[1];
//     try {
//       jwt.verify(authToken, theSecretKey, (err, decodedToken) => {
//         if (err || !decodedToken) {
//           res.status(401);
//           res.json({
//             error: "Unauthorized"
//           });
//         }
//         console.log('Welcome', decodedToken.name);
//         res.json({"Authorized"})
//       });
//     } catch (e) {
//       res.status(401);
//       res.send({
//         error: "Unauthorized "
//       });
//     }
//   } else {
//     res.status(401);
//     res.send({
//       error: "Unauthorized "
//     });
//   }
// });

// Users
app.get("/api/users", userGet);
app.get("/api/userLogin", userLogin);
app.post("/api/users", userPost);
app.patch("/api/users", userPatch);
app.put("/api/users", userPatch);
app.delete("/api/users",userDelete);

// Prompts
app.get("/api/allPrompts", promptRequestGet);
app.get("/api/prompts", promptRequestGetbyUser);
app.post("/api/prompts", promptRequestPost);
app.patch("/api/prompts", promptRequestPatch);
app.put("/api/prompts", promptRequestPatch);
app.delete("/api/prompts",promptRequestDelete);

// Tags
app.get("/api/allTags", tagGet);
app.get("/api/tags", tagByUser);
app.post("/api/tags", tagPost);
app.patch("/api/tags", tagPatch);
app.put("/api/tags", tagPatch);
app.delete("/api/tags",tagDelete);


// Listen Port
app.listen(3001, () => console.log(`App listening on port 3001!`))