const express = require('express');
const homeRouter = express.Router();
const { auth } = require('./auth');
const User = require('../models/user')

homeRouter.get('/home',(req,res)=>{
    res.render('layouts/home',{
        activeHome: true,
        req: req
    });
})

homeRouter.get('/',(req,res)=>{
    res.redirect('/home');
})

module.exports = homeRouter;
