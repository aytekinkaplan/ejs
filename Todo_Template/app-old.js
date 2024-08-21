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

// AsyncErrors to errorHandler:
require('express-async-errors')

// app.all('/', (req, res) => {
//     res.send('WELCOME TO TODO API')
// })

/* ------------------------------------------------------- */
// SEQUELIZE:
// $ npm i sequelize sqlite3

const { Sequelize, DataTypes } = require('sequelize')

// Connection Object:
// const sequelize = new Sequelize('sqlite:./db.sqlite3')
// const sequelize = new Sequelize('sqlite:' + process.env.SQLITE)
const sequelize = new Sequelize('sqlite:' + (process.env.SQLITE || './db.sqlite3'))

// Sequelize Model:
// Her bir model, veritabanında bir tabloya karşılık gelir.
// sequelize.define('tableName', { ...columns })
const Todo = sequelize.define('todos', {

    // ID sutunu belirtmeye gerek yoktur. Sequelize ID sutununun otomatik oluşturur:
    // id: {
    //     type: DataTypes.INTEGER, // DataType // sutun veri tipi.
    //     allowNull: false, // default: true // sutun verisi boş olabilir mi?
    //     unique: true, // default: false // benzersiz kayıt mı?
    //     defaultValue: 0, // Kayıt eklendiğinde default olarak ne yazılsın?
    //     // autoIncrement: true, // default: false, // Sutun değeri her bir jayıtta otomatik olarak +1 artsın mı?
    //     // primaryKey: true, // default: false // tablonun her bir kaydını ifade eden benzersiz numara.
    //     // comment: 'yorum ekleyebiliriz',
    //     // field: 'custom_field_name'
    // },

    title: {
        type: DataTypes.STRING(256), // varchar(256)
        allowNull: false
    },

    description: DataTypes.TEXT, // ShortHand

    priority: { // 1: High, 0: Normal, -1: Low
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },

    isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

    // createdAt ve updatedAt tanımlamaya gerek yok. Otomatik oluşturulur.

})

// Syncronization: (Bir kere çalıştır.)
// Modelleri veritabanına uygula:
// sequelize.sync() // CREATE TABLE // First Command.
// sequelize.sync({ force: true }) // DROP TABLE & CREATE TABLE
// sequelize.sync({ alter: true }) // TO BACKUP & DROP TABLE & CREATE TABLE & FROM BACKUP

// Connect to DB:
sequelize.authenticate()
    .then(() => console.log('* DB Connected *'))
    .catch(() => console.log('* DB Not Connected *'))

/* ------------------------------------------------------- */
// ROUTES:

const router = express.Router()

// LIST TODOS:
router.get('/', async (req, res) => {

    // const data = await Todo.findAll()
    const data = await Todo.findAndCountAll()

    res.status(200).send({
        error: false,
        result: data
    })

})

// CRUD: Create Read Update Delete

// CREATE TODO:
router.post('/', async (req, res) => {

    // const receivedData = req.body
    // // console.log(receivedData)

    // const data = await Todo.create({
    //     title: receivedData.title,
    //     description: receivedData.description,
    //     priority: receivedData.priority,
    //     isDone: receivedData.isDone
    // })
    // // console.log(data)

    const data = await Todo.create(req.body)
    // console.log(data)

    res.status(201).send({
        error: false,
        result: data.dataValues
    })

})

// READ TODO:
router.get('/:id', async (req, res) => {

    // const data = await Todo.findOne({ where: { id: req.params.id } })
    const data = await Todo.findByPk(req.params.id)

    res.status(200).send({
        error: false,
        result: data
    })

})

// UPDATE TODO:
router.put('/:id', async (req, res) => {

    // const data = await Todo.update({ ...newData }, { ...filter })
    const data = await Todo.update(req.body, { where: { id: req.params.id } })
    // console.log(data)

    res.status(202).send({
        error: false,
        result: data,
        message: (data[0] >= 1 ? 'Updated' : 'Can not Updated.'),
        new: await Todo.findByPk(req.params.id) // Güncellenmiş kaydı göster.
    })

})

// DELETE TODO:
router.delete('/:id', async (req, res) => {

    // const data = await Todo.destroy({ ...filter })
    const data = await Todo.destroy({ where: { id: req.params.id } })
    // console.log(data)

    // res.status(204).send({
    //     error: false,
    //     result: data,
    //     message: (data >= 1 ? 'Deleted.' : 'Can not Deleted.'),
    // })

    if (data >= 1) {
        // Deleted:
        // res.status(200).send({
        //     error: false,
        //     result: data,
        //     message: 'Deleted'
        // })

        // Sadece statusCode çıktısı ver:
        res.sendStatus(204)

    } else {
        // Not Deleted:
        // res.status(404).send({
        //     error: true,
        //     result: data,
        //     message: 'Can not Deleted'
        // })

        // Send to ErrorHandler:
        res.errorStatusCode = 404
        throw new Error('Can not Deleted. Maybe already deleted.')

    }

})

app.use(router)

/* ------------------------------------------------------- */
/* ------------------------------------------------------- */
/* ------------------------------------------------------- */

const errorHandler = (err, req, res, next) => {
    const errorStatusCode = res.errorStatusCode ?? 500
    console.log('errorHandler worked.')
    res.status(errorStatusCode).send({
        error: true, // special data
        message: err.message, // error string message
        cause: err.cause, // error option cause
        // stack: err.stack, // error details
    })
}
app.use(errorHandler)
/* ------------------------------------------------------- */
app.listen(PORT, () => console.log("Running: http://127.0.0.1:" + PORT));