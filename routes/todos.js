const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Todo = require('../models/todo')
const SECRET_KEY = process.env.MY_SECRET

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized request!')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
        return res.status(401).send('Unauthorized request!')
    }
    let payload = jwt.verify(token, SECRET_KEY)
    if(!payload) {
        return res.status(401).send('Unauthorized request!')
    }
    req.userId = payload.subject 
    next()
}

router.post('/todo', (req, res) => {
    const todoData = req.body
    const todo = new Todo(todoData)
    todo.save((err, savedTodo) => {
        if(err) {
            console.log('Error saving Todo')
        } else {
            console.log('Todo saved: ', savedTodo)
            res.status(200).send(savedTodo)
        }
    })
})

router.get('/todo', verifyToken, (req, res) => {
    Todo.find({}, (err, result) => {
        if(err) {
            console.log('Error retrieving todos')
        } else {
            res.send(result)
        }
    })
})

router.delete('/todo/:id', (req, res) => {
    const todoId = req.params.id
    Todo.findByIdAndDelete(todoId, (err, deletedTodo) => {
        if(err) {
            console.log('Error saving Todo')
        } else {
            console.log('Todo deleted: ', deletedTodo)
            res.status(200).send(deletedTodo)
        }
    })
})

router.put('/todo', (req, res) => {
    const todoData = req.body
    const todo = new Todo({
        _id: todoData._id,
        label: todoData.label,
        due: '88/88/8888'
    })
    Todo.findOneAndUpdate({_id: todoData._id}, todo, (err, updatedTodo) => {
        if(err) {
            console.log('Error saving Todo')
        } else {
            console.log('Todo updated: ', updatedTodo)
            res.status(200).send(updatedTodo)
        }
    })
})

module.exports = router