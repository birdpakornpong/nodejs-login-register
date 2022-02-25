const express = require("express")
const path = require("path")
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt")
const dbConnection = require("./database");
const { body, validationResult } = require('express-validator');

const app = express()
app.use(express.urlencoded({ extended: false}))

app.set('views', path.join(__dirname, 'views')) // set ui folder
app.set('view engine', 'ejs') // set ejs view engine

app.use(cookieSession({
    name: "session",
    keys: ['key1', 'key2'],
    maxAge: 3600 * 1000 // 1hr
}))

// Declaring Custom Middleware
const ifNotLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render('login-register')
    }
    next()
}

// root page
app.get('/', ifNotLoggedIn, (req, res, next) => {
    dbConnection.execute("SELECT name FROM users WHERE id = ?", [req.session.userID])
    .then(([rows]) => {
        res.render('home', {
            name: rows[0].name
        })
    })
})

app.listen(3000, () => console.log("Server is running..."))