const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Utility: Check if username is valid (e.g., not empty)
const isValid = (username) => {
  return username && typeof username === "string";
};

// Utility: Check if username and password match any user
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// User login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if credentials are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Authenticate
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User logged in successfully." });
  } else {
    return res.status(401).json({ message: "Invalid credentials." });
  }
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/updated successfully." });
});

// ✅ DELETE book review by logged-in user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in." });
  }

  if (!books[isbn] || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found." });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Your review has been deleted." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
