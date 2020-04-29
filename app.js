const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
const fs = require('fs');


require('./config/passport')(passport);

const {getHomePage } = require('./routes/index');
const { getEmpresaProfile,  deletePlayer, editPlayer, editPlayerPage} = require('./routes/player');
const port = 3893;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'socka'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
app.use(morgan('dev'));
app.use(cookieParser());
// routes for the app


app.get('/empresas', getHomePage);
app.get('/empresaProfile/:id',  getEmpresaProfile);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);

app.post('/edit/:id', editPlayer);


app.use(session({
    secret: 'justasecret',
    resave:true,
    saveUninitialized: true
   }));
   
   app.use(passport.initialize());
   app.use(passport.session());
   app.use(flash());
   
   require('./app/routes.js')(app, passport,fs);
   
   



   
// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});



