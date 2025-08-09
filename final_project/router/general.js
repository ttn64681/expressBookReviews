const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(404).json({ message: "Both username and password must be provided" });
    }
    if (isValid(username)) {
        users.push({ username, password });
        return res.json({ message: "User successfully registered" });
    } else {
        return res.status(409).json({ message: "Username exists already" });
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const getBooks = new Promise((res, rej) => {
        if (books) {
            res(books);
        } else {
            rej({ message: "books not found" });
        }
    });

    getBooks.then((books) => res.json(books)).catch((err) => res.status(404).json(err));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;

    const getBook = new Promise((res, rej) => {
        if (books[isbn]) {
            res(books[isbn]);
        } else {
            rej({ message: `Book at isbn ${isbn} not found` });
        }
    });

    getBook.then((book) => res.json(book)).catch((err) => res.status(404).json(err));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let author = req.params.author;

    getBooksByAuthor = new Promise((res, rej) => {
        let booksByAuthor = []
        Object.keys(books).forEach((isbn) => {
            if (books[isbn].author === author) {
                booksByAuthor.push(books[isbn]);
            }
        })
        if (booksByAuthor.length > 0) {
            res(booksByAuthor);
        } else {
            rej({ message: `No books found by author ${author}` });
        }
    });

    getBooksByAuthor.then((booksArr) => res.json(booksArr)).catch((err) => res.status(404).json(err));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;

    const getBooksByTitle = new Promise((res, rej) => {
        let booksByTitle = []

        Object.keys(books).forEach((isbn) => {
            if (books[isbn].title === title) {
                booksByTitle.push(books[isbn]);
            }
        })

        if (booksByTitle.length > 0) {
            res(booksByTitle);
        } else {
            rej({ message: `No books found by title ${title}` });
        }
    })
    
    getBooksByTitle.then((booksArr) = res.json(booksArr)).catch((err) => res.status(404).json(err));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;

    if (books[isbn]) {
        return res.json(books[isbn].review);
    } else {
        return res.status(404).json({ message: "No reviews found by isbn ${isbn}" });
    }
});

module.exports.general = public_users;
