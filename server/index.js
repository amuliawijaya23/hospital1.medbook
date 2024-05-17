require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const partials = require('express-partials');
const http = require('http');
const passport = require('passport');

const initializePassport = require('./auth');
const routers = require('./routers');

const PORT = process.env.PORT || 3001;
const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './views'));
app.use(partials());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(methodOverride());
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve(__dirname, '/public')));

app.use(routers());

// initializes passport config

initializePassport();

/*
  The code below is for using React
*/

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.resolve(__dirname, '../client/build')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
//   });
// }

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
