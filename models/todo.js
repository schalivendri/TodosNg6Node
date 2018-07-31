const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    label: String,
    due: String
})

module.exports = mongoose.model('todo', todoSchema, 'todos')