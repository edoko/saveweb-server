const express = require('express')
const passport = require('passport')
const User = require('../models/user')

const router = express.Router()

// register
router.post('/signup', function (req, res) {
  User.register(new User({ email: req.body.email }), req.body.password, req.body.name, function (err, user) {
    if (err) {
      return res.status(422).json('Failure Sign Up')
    }

    passport.authenticate('local')(req, res, function () {
      res.status(200).json('Success Sign Up!')
    })
  })
})

// login
router.post('/signin', passport.authenticate('local'), (req, res) => {
  res.json(req.user)
})

// logout
router.post('/signout', (req, res) => {
  req.logout()
  res.status(200).json('sign_out')
})

module.exports = router;
