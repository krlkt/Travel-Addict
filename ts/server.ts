const express = require("express")
const app = express()
const port = 3000

const knex = require('../db/knex')
const Redis = require('redis')
const redisClient = Redis.createClient()

app.use(express.json())

app.get('/hello/:name', (req, res) => {
    res.send(`Hallo ${req.params.name}`)
})

app.get('/users', function (req, res) {
    knex.select().from('users')
        .then(function (user) {
            res.send(user)
        })
})

app.get('/users/:id', function (req, res) {
    knex.select().from('users').where('id', req.params.id)
        .then(function (user) {
            res.send(user)
        })
})

app.post("/users", (req, res) => {
    knex('users').insert({
        name: req.body.name,
        email: req.body.email
    }).then(function () {
        knex.select().from('users').then(function (users) {
            res.send(users)
        })
    })
})

app.put('/users/:id', (req, res) => {
    knex('users').where('id', req.params.id)
        .update({
            name: req.body.name,
            email: req.body.email
        }).then(function () {
            knex.select().from('users').then(function (users) {
                res.send(users)
            })
        })
})

app.delete('/users/:id', (req, res) => {
    knex('users').where('id', req.params.id).del()
        .then(function () {
            knex.select().from('users').then(function (users) {
                res.send(users)
            })
        })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})