var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { Wechaty } = require('wechaty')

var app = express();

/////////////////////////////////////////////////////////////////
//WECHATY START
global.wechatyQr = '';
global.msgsentCount = 0;
function onScan (qrcode, status) {
  //require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  global.wechatyQr = qrcodeImageUrl;

  //console.log(qrcodeImageUrl)  
  
}

function onLogin (user) {
  console.log(`${user} login~`)
}

function onLogout(user) {
  console.log(`${user} logout`)
}

async function onMessage (msg) {
  //console.log(msg.toString())
  
  


}


global.bot = new Wechaty();
global.bot.on('scan',    onScan)
global.bot.on('login',   onLogin)
global.bot.on('logout',  onLogout)
global.bot.on('message', onMessage)

global.bot.start()
  .then(() => 
  {      
    console.log('Starter Bot Started.')
  })
  .catch(e => console.error(e))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
