"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */

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

// MODEL EXPORT:
module.exports = Todo
