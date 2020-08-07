const express = require('express');
const homeRouter = express.Router();
const { auth } = require('./auth');
const User = require('../models/user')

homeRouter.get('/home',auth,(req,res)=>{
    const id_user = req.user._id;
    User.findById(id_user,(err,user)=>{
        req.user = user;
        console.log(user)
    })
    res.render('layouts/home',{
        active: true,
        req: req
    });
})

homeRouter.get('/',(req,res)=>{
    res.redirect('/home');
})

module.exports = homeRouter;
