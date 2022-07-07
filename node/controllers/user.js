const User = require("../models/user")
const {validationResult} = require('express-validator')
const user = require("../models/user")
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')


//signin

exports.signin = (req, res) => {
  const {email, password} = req.body

  User.findOne({email}, (err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: "Email was not found"
      })
    }

    // Authenticate user
    if(!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match"
      })
    }

    // Create token
    const token = jwt.sign({_id: user._id}, process.env.SECRET)

    // Put token in cookie
    res.cookie('token', token, {expire: new Date() + 1})

    // Send response
    const {_id, name, email} = user
    return res.json({
      token,
      user: {
        _id,
        name,
        email
      }
    })
    
  })
}
