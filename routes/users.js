const express = require('express');
const router = express.Router();
const User = require('../models/user');
const moment = require('moment');
const {auth} = require('./auth');

router.get('/users',auth,(req,res)=>{
    
    User.find({},(err,users)=>{
        for(i in users)
        {
            date = new Date(users[i].createdAt);
            d = moment(date).format("DD-MM-YYYY  hh:mm") ;
            users[i].date = d;
        }
        res.render('layouts/dashboard',{
            users:users,
            req:req,
            activeDash:true,
            showUsers:true});
    })
});

router.get('/users/delete/:id',auth,(req,res)=>{
    User.findByIdAndRemove({_id:req.params.id},(err,users)=>{
        if(!err)
        {
            res.redirect('/users');
        }
    })
});


module.exports = router;