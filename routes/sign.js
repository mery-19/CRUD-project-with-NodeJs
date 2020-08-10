const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {validateSignin, validateSignUp} = require('../models/validate');
const {validationResult} = require('express-validator');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const {loginAuth}=require('./auth');

router.use(express.json());

/************ sign in start *****************/ 
router.get('/signin',loginAuth,(req,res)=>{
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
                            res.redirect('/signup')
                        }
                    })
                }
            }
        })
    }
});
/************ sign in End *****************/ 

/************ sign up start *****************/ 
router.get('/signup',loginAuth,(req,res)=>{
    res.render('sign/signup');
});

router.post('/signup',validateSignUp,(req,res)=>{
    console.log(req.session);
    User.findOne({email:req.body.email},async (err,user)=>{
        if(!err){
            if(user){
                const compare = await bcrypt.compare(req.body.password,user.password);
                if(compare)
                {
                    // sign jwt
                    const token = jwt.sign({_id: user._id},process.env.SECRET_KEY);
                    req.session.token = token;
                    req.user = user;
                    res.redirect('/home');

                }else {
                    res.render('sign/signup',{
                        error:"*Password or Email Incorrect."
                    })
                }
            }else {
                res.render('sign/signup',{
                    error:"*Password or Email Incorrect."
                })
            }
        }else {
            res.status(400).send(err);
        }
    })
});
/************ sign up End *****************/ 

/************ log out start *****************/ 
router.get('/logout',(req,res)=>{
    console.log(req.session)
    if(req.session){
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
      }else{
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
      }
});
/************ log out End *****************/ 

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
