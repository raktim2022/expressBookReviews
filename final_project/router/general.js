const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let myPromise = new Promise((resolve,reject) => {
    resolve(books);
  })
  myPromise.then((bookList) => {
    res.send(JSON.stringify(bookList, null, 4));
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let myPromise = new Promise((resolve,reject) => {
    if (books[isbn]) {
        resolve(books[isbn]);
    } else {
        reject("Book not found");
    }
  })
  myPromise.then((book) => {
    res.send(book);
  }).catch(err => {
      res.status(404).json({message: err});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let myPromise = new Promise((resolve,reject) => {
        const bookKeys = Object.keys(books);
        let booksByAuthor = [];
        for (const key of bookKeys) {
            if (books[key].author === author) {
            booksByAuthor.push(books[key]);
            }
        }
        if(booksByAuthor.length > 0){
            resolve(booksByAuthor);
        }
        else{
            reject("No books by this author found");
        }
    });

    myPromise.then((booksFound) => {
        res.send(booksFound);
    }).catch(err => {
        res.status(404).json({message: err});
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let myPromise = new Promise((resolve,reject) => {
        const bookKeys = Object.keys(books);
        let booksByTitle = [];
        for (const key of bookKeys) {
            if (books[key].title === title) {
            booksByTitle.push(books[key]);
            }
        }
        if(booksByTitle.length > 0){
            resolve(booksByTitle);
        }
        else{
            reject("No books with this title found");
        }
    });

    myPromise.then((booksFound) => {
        res.send(booksFound);
    }).catch(err => {
        res.status(404).json({message: err});
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
