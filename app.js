const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
require('dotenv').config();
const mongoose = require('mongoose');


// connect to db (mongoDB)
mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true },()=>{
    console.log("connect successfully to database.")
});

// routers
const signRouter = require('./routes/sign')


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());

// set engine template
app.set('views', path.join(__dirname,'/views/'));
app.engine('hbs',exphbs({extname: 'hbs',defaultLayout: 'main', layoutsDir: __dirname+'/views/layouts/', handlebars:allowInsecurePrototypeAccess(handlebars)}));
app.set('view engine', 'hbs');

app.use('/',signRouter);

app.listen(3000,()=>{
    console.log("application running on: http://localhost:3000");
})