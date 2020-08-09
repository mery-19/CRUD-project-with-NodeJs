const { get } = require("mongoose");

const express = require('express');
const dashRouter = express.Router();

dashRouter.route('/dashboard')
.get((req,res)=>{
    res.render('layouts/dashboard',
    {
        req: req,
        activeDash:true
    });
})

module.exports = dashRouter;
