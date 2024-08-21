"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */

const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 8000;

/* ------------------------------------------------------- */
// Accept json data and convert to object:
app.use(express.json())
// Accept form data and convert to object:
app.use(express.urlencoded({ extended: true }))

// AsyncErrors to errorHandler:
require('express-async-errors')

/* ------------------------------------------------------- */
// TEMPLATES:
// $ npm i ejs
// https://ejs.co/

app.set('view engine', 'ejs')
// Default template folder: ./views
app.set('views', './public')


app.all('/', (req ,res) => {

    // ./views klasörü içindeki dosyayı çağır:
    // res.render('index.ejs')
    // res.render('index')
    res.send(`
        <p><a href="/view">Todo Template</a></p>    
        <p><a href="/api">Todo RestAPI</a></p>    
    `)

})


/* ------------------------------------------------------- */
// ROUTES:

// Model, controller'da kullanılacağı için orada require edilmelidir.
// const Todo = require('./app/models/todo.model')

app.use('/view', require('./app/routes/todo.router.view'))
app.use('/api', require('./app/routes/todo.router.api'))

/* ------------------------------------------------------- */
// ErrorHandler:
app.use(require('./app/middlewares/errorHandler'))
/* ------------------------------------------------------- */
app.listen(PORT, () => console.log("Running: http://127.0.0.1:" + PORT));