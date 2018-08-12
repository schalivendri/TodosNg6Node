const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync('ssl/server.key', 'utf8');
const certificate = fs.readFileSync('ssl/server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
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


var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(process.env.PORT || 3000);
httpsServer.listen(process.env.PORT || 3001);

app.use(function(req, res, next) {
    if(!req.secure) {
        return res.redirect('https://' + req.headers.host + req.path);
    }
    next();
});
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
    res.sendFile(__dirname + '/public/dist/ng6-todos/index.html');
});

app.use('/api', todos)

app.use('/user', users)

app.get('*',function(req,res){
    res.sendFile(__dirname + '/public/dist/ng6-todos/index.html');
});

/* app.listen(PORT, function() {
    console.log('Server running on localhost: ' + PORT)
}) */