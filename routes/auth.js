const jwt = require('jsonwebtoken');
const User = require('../models/user');

function auth(req,res,next)
{
    const token = req.session.token;
    console.log("the token", token)
    if(!token) res.status(304).redirect('/error');

    try{
        const verify = jwt.verify(token,process.env.SECRET_KEY);
        req.user = verify;
        User.findById(verify._id,(err,user)=>{
            if(!err){ 
                req.user.name = user.name;
                req.session.user = user.name}

        })
        console.log(verify)
        next();
    }catch(err){
        res.status(400).send(err)
    }
}

function loginAuth(req,res,next)
{
    const token = req.session.token;
    if(token)
    {
        try{
            const verify = jwt.verify(token,process.env.SECRET_KEY);
            req.user = verify;
            res.status(304).redirect('/dashboard');
        }catch(err){
            res.status(400).send("Invalid User.")
        }
    }
    next();
}

module.exports.auth = auth;
module.exports.loginAuth = loginAuth;