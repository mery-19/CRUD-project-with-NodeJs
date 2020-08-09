const { get } = require("mongoose");

const express = require('express');
const errorRouter = express.Router();

errorRouter.route('/error')
.get((req,res)=>{
    res.render('layouts/error');
})

module.exports = errorRouter;
