const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
require('dotenv').config();
const mongoose = require('mongoose');
// set https server
const https = require('https');
const fs = require('fs');


// connect to db (mongoDB)
mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true },()=>{
    console.log("connect successfully to database.")
});

// routers
const signRouter = require('./routes/sign');
const userRouter = require('./routes/users');

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + '3443' + req.url);
  }
});

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());

// set engine template
app.set('views', path.join(__dirname,'/views/'));
app.engine('hbs',exphbs({extname: 'hbs',defaultLayout: 'main', layoutsDir: __dirname+'/views/layouts/', handlebars:allowInsecurePrototypeAccess(handlebars),helpers:{
    incremented:function (index) {
        index++;
        return index;
    }
}}));
app.set('view engine', 'hbs');


app.use('/',signRouter);
app.use('/',userRouter);


app.listen(3000,()=>{
    console.log("application running on: http://localhost:3000");
})

// ********** HTTPS and secure communication Start**************//
var options = {
    key: fs.readFileSync(__dirname+'/openSSL/private.key'),
    cert: fs.readFileSync(__dirname+'/openSSL/certificate.pem')
  };
var secureServer = https.createServer(options,app);

secureServer.listen(3443, () => {
    console.log("secure server: https://localhost:3443");
});

// ********** HTTPS and secure communication END**************//