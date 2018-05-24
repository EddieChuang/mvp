const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const request = require('request')
const async = require('async')
const expressHbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')


const app = express()


app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev')) // read requests that user made
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "chiamin",
  store: new MongoStore({url: 'mongodb://<user>:<password>@hostname:port/db'})
}))
app.use(flash())



app.route('/')
  .get((req, res, next) => {
    res.render('main/home', {message: req.flash('succcess')})
  })
  .post((req, res, next) => {
    // capture user's email
    request({
      url: 'https://us18.api.mailchimp.com/3.0/lists/{list_id}/members',
      method: 'POST',
      headers: {
        'Authorization': 'randomUser api_key',
        'Content-Type': 'application/json'
      },
      json: {
        'email_address': req.body.email,
        'status': 'subscribed'
      }
    }, (err, response, body) => {
      if(err){
        console.log(err)
      } else {
        req.flash('success', 'You have submitted your email')
        res.redirect('/')
      }
    })
  })

// session = memory store, if you want to perserve the data for future use
// Data Store = mongodb, redis








app.listen(3030, (err) => {
  if(err){
    console.log(err)
  } else {
    console.log('Running on Port 3030 ...')
  }
})



