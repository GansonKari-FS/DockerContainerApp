require("dotenv").config();

const express = require("express");
const { auth, requiresAuth } = require("express-openid-connect");

const app = express();
const PORT = process.env.PORT || 3000;

// Auth0 authentication configuration
app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    routes: {
      login: "/login",
      logout: "/logout",
      callback: "/callback",
    },
  }),
);

// Home page
app.get("/", (req, res) => {
  const loggedIn = req.oidc.isAuthenticated();

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport"
            content="width=device-width, initial-scale=1.0">
      <title>Docker Container App</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #101827;
          color: white;
          text-align: center;
          padding: 80px 20px;
        }
        .container {
          max-width: 650px;
          margin: auto;
          background: #1e293b;
          padding: 40px;
          border-radius: 15px;
        }
        h1 { color: #38bdf8; }
        p { line-height: 1.7; }
        a {
          display: inline-block;
          background: #0284c7;
          color: white;
          padding: 12px 25px;
          margin: 10px;
          border-radius: 8px;
          text-decoration: none;
        }
        a:hover { background: #0369a1; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Docker Container App</h1>
        <p>Full Sail University</p>
        <p>Node.js | Express | Docker | Auth0 | AWS</p>

        <h2>
          ${loggedIn ? "You are logged in!" : "Welcome!"}
        </h2>

        ${
          loggedIn
            ? `
              <a href="/profile">View Profile</a>
              <a href="/logout">Log Out</a>
            `
            : `<a href="/login">Log In with Auth0</a>`
        }
      </div>
    </body>
    </html>
  `);
});

// Protected profile route
app.get("/profile", requiresAuth(), (req, res) => {
  res.json({
    message: "You are successfully authenticated!",
    user: {
      name: req.oidc.user.name,
      email: req.oidc.user.email,
      picture: req.oidc.user.picture,
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Application is healthy",
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
