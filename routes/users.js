const express = require('express');
const { route } = require('./sign');
const router = express.Router();
const User = require('../models/user');
var moment = require('moment');

router.get('/users',(req,res)=>{
    User.find({},(err,users)=>{
        for(i in users)
        {
            date = new Date(users[i].createdAt);
            d = moment(date).format("DD-MM-YYYY hh:mm:ss") ;
            users[i].date = d;
        }
        res.render('users/show',{users});
    })
});

router.get('/users/delete/:id',(req,res)=>{
    User.findByIdAndRemove({_id:req.params.id},(err,users)=>{
        if(!err)
        {
            res.redirect('/users');
        }
    })
});

module.exports = router;