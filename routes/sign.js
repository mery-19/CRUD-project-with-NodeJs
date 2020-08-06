const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {validateSignin} = require('../models/validate');
const {validationResult} = require('express-validator');

router.use(express.json());

router.get('/signin',(req,res)=>{
    res.render('signin');
});

router.post('/signin',validateSignin,(req,res)=>{

    const errors = validationResult(req).errors;
    if(errors.length)
    {
        handleError(errors,req.body);
        res.render('signin',{
            user: req.body
        })
    }else{
        User.findOne({email:req.body.email},(err,user)=>{
            if(!err){
                if(user){
                    res.status(400).send("User already exist");
                }else {
                    User.create(req.body,(err,user1)=>{
                        if(err)
                        {
                            res.status(400).send(err);
                        }else{
                            res.status(200).send(user1);
                        }
                    })
                }
            }
        })
    }
});


function handleError(errors,body){
    for(err in errors)
    {
        switch(errors[err].param)
        {
            case 'name': body.errName = errors[err].msg+' for name.';break;
            case 'email': body.errEmail = errors[err].msg+' for Email.';break;
            case 'password': body.errPassword = errors[err].msg+' for Password.';break;
            case 'repassword': body.errRepassword = errors[err].msg;break;
        }
    }
};

module.exports = router;
