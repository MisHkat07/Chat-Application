const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const { notFoundHandler, errorHandler } = require('./middlewares/common/errorHandler');
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");

const app = express();
dotenv.config();

// Database Connecting 
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
   useNewUrlParser: true,
   useUnifiedTopology: true
}).then(() => console.log('Database Connection Successful!')
).catch(err => console.log(err));

// Request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine 
app.set('view engine', 'ejs');

// Set Static Folder 
app.use(express.static(path.join(__dirname, "public")));

// Set cookie-parser 
app.use(cookieParser(process.env.COOKIE_SECRET));

// Routing Setting
app.use('/', loginRouter)
app.use('/users', usersRouter)
app.use('/inbox', inboxRouter)

// Error Handling
// 404 Handler 
app.use(notFoundHandler);

// common erro handler 
app.use(errorHandler)

app.listen(process.env.PORT, () => {
   console.log(`App listening to ${process.env.PORT}`);
      })