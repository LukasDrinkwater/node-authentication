const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res, next) => {
  res.json({
    message: "welcome to the api",
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// varify token
const verifyToken = (req, res, next) => {
  // get auth header value
  const bearerHeader = req.headers["authorization"];
  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token fromo array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

app.post("/api/posts", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "post created",
        authData,
      });
    }
  });
});

app.post("/api/login", (req, res, next) => {
  // mock user
  const user = {
    id: 1,
    username: "brad",
    email: "brad@gmail.com",
  };

  jwt.sign(
    {
      user: user,
    },
    "secretkey",
    {
      expiresIn: "30s",
    },
    (err, token) => {
      res.json({
        token,
      });
    }
  );
});

app.listen(3000, () => console.log(`server started on`));
