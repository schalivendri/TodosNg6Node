const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const SECRET_KEY = 'secretKey'

router.post('/register', (req, res) => {
    let userData = req.body
    let user = new User(userData)
    User.findOne({ email: userData.email }, (err, obj) => {
        if (!obj) {
            user.save((err, registeredUser) => {
                if (err) {
                    console.log('Error registering User: ', err)
                } else {
                    let payload = { subject: registeredUser._id }
                    let token = jwt.sign(payload, SECRET_KEY)
                    res.status(200).send({ token })
                }
            })
        } else {
            res.status(500).send('Email already exists')
        }
    })

})

router.post('/login', (req, res) => {
    let userData = req.body
    User.findOne({ email: userData.email }, (err, user) => {
        if (err) {
            console.log('Error with User login: ', err)
        } else if (!user) {
            res.status(401).send('Invalid Email')
        } else if (userData.password !== user.password) {
            res.status(401).send('Incorrect Password')
        } else {
            let payload = { subject: user._id }
            let token = jwt.sign(payload, SECRET_KEY)
            res.status(200).send({ token })
        }
    })
})

module.exports = router