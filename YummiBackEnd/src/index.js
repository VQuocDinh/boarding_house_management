const express = require('express')
const app = express()
const path = require('path')
const Router = require('./routes/index')
const PORT = 3001;
const cookieParser = require('cookie-parser');
const session = require('express-session')
const passport = require('passport');
const passportSetup = require('./app/passport')
require('dotenv').config();

app.use(cookieParser());

var cors = require('cors')
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions))

app.use(session({
    secret : 'keyboardcat',
    resave : false,
    saveUninitialized : true,
    cookie : {secure : false}
}))

app.use(passport.initialize());
app.use(passport.session());



app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({
    extended : true
}));


app.use(express.json());

Router(app);



app.listen(PORT)