const express = require('express');
const route = express.Router();
const Event = require('../models/event');
const User = require('../models/user');
const moment = require('moment')

route.get('/events',(req,res)=>{
    Event.find({},(err,events)=>{
        res.render('events/show',{
            events:events,
            activeEvents:true,
            req:req
        });
    })
});

route.post('/create',(req,res)=>{
    Event.create(req.body, (err,event)=>{
        if(!err)
        {
            res.redirect('/show')
        }else {
            res.status(400).send(err);
        }
    })
    
});

route.get('/create',(req,res)=>{
    res.render('layouts/dashboard',{
        activeDash:true,
        create:true,
        req:req
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
                activeDash:true,
                showEvents:true,
                req:req
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