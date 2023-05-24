require('dotenv').config()
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const verifyLoggedIn = require('./controllers/middlewares/verifyLogin')


const app = express()


// session middleware
app.use(session({
    secret: process.env.SESSION_TOKEN,
    resave: false,
    saveUninitialized: false,
}));


// view engine
app.set('view engine', 'ejs')

// static
app.use(express.static('public'))

mongoose.connect('mongodb+srv://test4:test4@user4.wtjiugw.mongodb.net/test4?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB', err);
  });

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(verifyLoggedIn)

app.use('/login', require('./routes/login'))
app.use('/register', require('./routes/register'))
app.use('/logout', require('./routes/logout'))

app.listen(process.env.PORT, ()=>{
    console.log(`server running on http://localhost:${process.env.PORT}`)
})