const express = require('express');
const route = express.Router();
const Event = require('../models/event');
const User = require('../models/user');
const moment = require('moment')

route.get('/events',(req,res)=>{
    console.log(req.session);
    res.render('events/show');
});

route.post('/create',(req,res)=>{
    console.log(req.session);
    Event.create(req.body, (err,user)=>{
        if(!err)
        {
            console.log(user);
            res.status(200).send(user);
        }else {
            res.status(400).send(err);
        }
    })
    
});

route.get('/create',(req,res)=>{
    console.log(req.body);
    res.render('layouts/dashboard',{
        create:true
    });
});

route.get('/show',(req,res)=>{
    Event.find({},(err,events)=>{
        if(!err)
        {
            for(i in events)
        {
            date = new Date(events[i].createdAt);
            d = moment(date).format("DD-MM-YYYY  hh:mm") ;
            events[i].date = d;
        }
            res.render('layouts/dashboard',{
                events:events,
                showUser:true
            });
        }
    })
    
});

route.get('/events/delete/:id',(req,res)=>{
    console.log(req.params.id)
    Event.findByIdAndRemove({_id:req.params.id},(err,event)=>{
        if(!err)
        {
            console.log(event)
            res.redirect('/show')
        }
    })
    
});

module.exports = route;