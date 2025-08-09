const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// { username: 'user', password: 'pwd'}
let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid

    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    // Return true if any valid user is found, otherwise false
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(404).json({ message: "Both username and password must be provided" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ username: username }, 'access', { expiresIn: 100000 })
        req.session.authorization = { accessToken, username }
        return res.status(200).json({ message: "User successfully logged in" });
    }
    return res.status(404).json({ message: "Invalid Credentials" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn;
    let review = req.query.review;
    let user = req.user.username;

    if (books[isbn]) { // book at isbn exists
        let bookReviews = books[isbn].reviews;
        if (bookReviews.hasOwnProperty(user)) { // user already exists
            bookReviews[user] = review;
            return res.json({ message: `Review for book at isbn ${isbn} successfully updated` })
        } else { // user doesn't exist
            bookReviews[user] = review;
            return res.status(201).json({ message: `Review for book at isbn ${isbn} successfully added` })
        }
    } else {
        return res.status(404).json({ message: `Book by isbn ${isbn} not found` });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let user = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: `Book by isbn ${isbn} not found` });
    }

    let bookReviews = books[isbn].reviews;
    if (bookReviews.hasOwnProperty(user)) { // user exists
        delete bookReviews[user];
        return res.status(200).json({ message: `Deleted user review for book at isbn ${isbn}` })
    } else { // user doesn't exist
        return res.status(404).json({ message: `No user review for book at isbn ${isbn} exists` })
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
