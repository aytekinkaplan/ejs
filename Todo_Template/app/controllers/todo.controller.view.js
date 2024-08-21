"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */

// Model:
const Todo = require('../models/todo.model')

const PRIORITIES = {
    '-1': 'Low',
    '0': 'Normal',
    '1': 'High'
}

module.exports = {

    list: async (req, res) => {

        const data = await Todo.findAndCountAll({
            order: [
                ['id', 'desc'],
            ]
        })

        // res.status(200).send({
        //     error: false,
        //     result: data
        // })
        // console.log(data)

        // View:
        res.render('index', { todos: data.rows, count: data.count, priorities: PRIORITIES })

    },

    // CRUD ->

    create: async (req, res) => {

        if (req.method == 'POST') {
            
            // Create:
            const data = await Todo.create(req.body)
            // Redirect:
            res.redirect('/view')

        } else {
            // View:
            res.render('todoCreate', { priorities: PRIORITIES })
        }

    },

    read: async (req, res) => {

        // const data = await Todo.findOne({ where: { id: req.params.id } })
        const data = await Todo.findByPk(req.params.id)
        // console.log(data)
        // res.status(200).send({
        //     error: false,
        //     result: data
        // })

        // View:
        res.render('todoRead', { todo: data.dataValues, priorities: PRIORITIES })

    },

    update: async (req, res) => {

        if (req.method == 'POST') {

            const data = await Todo.update(req.body, { where: { id: req.params.id } })

            res.redirect('/view')

        } else {

            const data = await Todo.findByPk(req.params.id)

            res.render('todoUpdate', { todo: data.dataValues, priorities: PRIORITIES })

        }

    },

    delete: async (req, res) => {

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
            // res.sendStatus(204)
            res.redirect('/view')

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

    }

}