const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {validateSignin, validateSignUp} = require('../models/validate');
const {validationResult} = require('express-validator');
const bcrypt= require('bcrypt');

router.use(express.json());

/************ sign in start *****************/ 
router.get('/signin',(req,res)=>{
    res.render('sign/signin');
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
        User.findOne({email:req.body.email},async (err,user)=>{
            if(!err){
                if(user){
                    res.status(400).send("User already exist");
                }else {
                    const hashPass = await bcrypt.hash(req.body.password,10);
                    const hashRepass = await bcrypt.hash(req.body.repassword,10);
                    console.log(hashPass);
                    const newUser={
                        name: req.body.name,
                        email: req.body.email,
                        password: hashPass,
                        repassword: hashRepass
                    }
                    User.create(newUser,(err,user1)=>{
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
/************ sign in End *****************/ 

/************ sign up start *****************/ 
router.get('/signup',(req,res)=>{
    res.render('sign/signup');
});

router.post('/signup',validateSignUp,(req,res)=>{

    const errors = validationResult(req).errors;
    if(errors.length)
    {
        handleError(errors,req.body);
        res.render('sign/signup',{
            user: req.body
        })
    }else{
        User.findOne({email:req.body.email},async (err,user)=>{
            if(!err){
                if(user){
                    const compare = await bcrypt.compare(req.body.password,user.password);
                    if(compare)
                    {
                        res.status(200).send("log in success");
                    }else {
                        res.status(400).send("pasword or email incorrect");
                    }
                }else {
                    console.log("Please create account First.")
                    res.render('sign/signup',{
                        error: "Please create account First."
                    })
                }
            }else {
                res.status(400).send(err);
            }
        })
    }
});
/************ sign up End *****************/ 

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
