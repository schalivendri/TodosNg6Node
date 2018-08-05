const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 3000;
const todos = require('./routes/todos')
const users = require('./routes/users')
const app = express()
const dbUser = process.env.TODOSDBUSER
const dbPswd = process.env.TODOSDBPSWD

app.use(cors())
app.use(bodyParser.json())

const db = 'mongodb://' + dbUser + ':' + dbPswd + '@ds153980.mlab.com:53980/todosdb'; 

mongoose.connect(db, err => {
    if(err) {
        console.log('Error connecting to Todos DB: ', err)
    } else {
        console.log('Successfully connected to Todos DB!')
    }
})

app.use(express.static(path.join(__dirname, '/public/dist/ng6-todos')));

app.get('/',function(req,res){
    res.sendFile('/public/dist/ng6-todos/index.html');
});

app.use('/api', todos)

app.use('/user', users)

app.listen(PORT, function() {
    console.log('Server running on localhost: ' + PORT)
})