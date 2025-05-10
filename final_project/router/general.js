// general.js
let books = require("./booksdb.js");
let express = require("express");
let public_users = express.Router();
const axios = require("axios"); // Axios is imported

// Task 10: Get the list of books using async/await and simulated Axios-style delay
public_users.get('/', async function (req, res) {
    try {
        // Simulated API-like function returning books after a delay
        const getBooksAsync = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(books);
                }, 1000); // simulate 1 second delay
            });
        };

        const bookList = await getBooksAsync();
        return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch book list" });
    }
});

// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("Book not found");
                }
            }, 500); // simulate half-second delay
        });
    };

    try {
        const book = await getBookByISBN(isbn);
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Task 3: Get books by author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Task 4: Get books by title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(book => book.title === title);

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
