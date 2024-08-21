"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */

// const router = express.Router()
const router = require('express').Router()

// Controller:
const todo = require('../controllers/todo.controller.api')

/* ------------------------------------------------------- */

router.route('/')
    .get(todo.list)
    .post(todo.create)

router.route('/:id')
    .get(todo.read)
    .put(todo.update)
    .delete(todo.delete)

module.exports = router