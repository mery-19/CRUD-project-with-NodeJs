const jwt = require('jsonwebtoken');

function auth(req,res,next)
{
    const token = req.session.token;
    console.log(req.session)
    console.log(token);
    if(!token) res.status(400).send("you are not authorize.")

    try{
        const verify = jwt.verify(token,process.env.SECRET_KEY);
        req.user = verify;
        console.log(req.user);
        next();
    }catch(err){
        res.status(400).send("Invalid User.")
    }
}

function loginAuth(req,res,next)
{
    console.log("enter")
    const token = req.session.token;
    console.log(token)
    if(token)
    {
        try{
            const verify = jwt.verify(token,process.env.SECRET_KEY);
            req.user = verify;
            res.status(304).redirect('/dashboard');
            // res.render('layouts/dashboard')
        }catch(err){
            res.status(400).send("Invalid User.")
        }
    }
    next();
}


module.exports.auth = auth;
module.exports.loginAuth = loginAuth;