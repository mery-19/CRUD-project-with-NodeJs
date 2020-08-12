const express = require('express');
const route = express.Router();
const Event = require('../models/event');
const User = require('../models/user');
const moment = require('moment');
const {auth} = require('./auth');

route.get('/events',(req,res)=>{
    Event.find({},(err,events)=>{
        res.render('events/show',{
            events:events,
            activeEvents:true,
            req:req
        });
    })
});

route.post('/create',auth,(req,res)=>{
    if(req.body.id != ''){
        console.log("update")
        Event.findByIdAndUpdate({_id: req.body.id},req.body,(err,event)=>{
            if(!err)
            {
                res.redirect('/show')
            }else {
                res.status(400).send(err);
            }
        })
    }else {
        console.log("create")
        Event.create(req.body, (err,event)=>{
            if(!err)
            {
                res.redirect('/show')
            }else {
                res.status(400).send(err);
            }
        })
    }
});

route.get('/create',auth,(req,res)=>{
    res.render('layouts/dashboard',{
        activeDash:true,
        create:true,
        req:req,
        title: 'Create New Event',
        submit: 'Create'
    });
});

route.get('/show',auth,(req,res)=>{
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
                req:req,
                
            });
        }
    })
    
});

route.get('/events/delete/:id',auth,(req,res)=>{
    console.log(req.params.id)
    Event.findByIdAndRemove({_id:req.params.id},(err,event)=>{
        if(!err)
        {
            console.log(event)
            res.redirect('/show')
        }
    })
    
});

route.get('/events/edit/:id',auth,(req,res)=>{

    Event.findById({_id:req.params.id},(err,event)=>{
        if(!err)
        {
            console.log(event);
            res.render('layouts/dashboard',{
                activeDash:true,
                create:true,
                req:req,
                title: 'Update Event',
                event: event,
                submit: 'Update'
            });
        }
    })
    
});

module.exports = route;