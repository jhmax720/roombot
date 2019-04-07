var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

const { Wechaty } = require('wechaty')
const Headcount = require('./models/Headcount');

var mongoose = require('mongoose');

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/roombot', { useNewUrlParser: true })
  .then(() => console.log('database connected'))
  .catch((err) => console.log(err));

var app = express();

/////////////////////////////////////////////////////////////////
//WECHATY START
global.wechatyQr = '';
//global.msgsentCount = 0;
function onScan (qrcode, status) {
  require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console
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
   var contact = msg.from();
  // var room = msg.room();
  if(!contact.name() )
  {
    await contact.sync()
  }
  


  // console.log('msg contact: ' +contact.name())
  
  // console.log('msg room: ' +room)
  // console.log('msg: ' +contact.city())
  if(msg.text() && msg.text().length>=40 && msg.room()) //
  {

    //console.log('room msg: '+ msg.room());
    Headcount.findOne({ name: contact.name() }).then((ahc) =>{
      if(ahc)
      {
        ahc.count++;
        ahc.save().catch(err => console.log(err));
      }
      else{
        var newhc = new Headcount(
          {
            name: contact.name(),
            count:1,
          }
        );
      
        newhc.save()
        // .then((user) => {
          //this will be send as a response to the application
          // const resUser = {
          //   name: user.name,
          //   email: user.email,
          // }
          //res.json(resUser)
        // })
      
        .catch(err => console.log(err));
      }

    })

   
  }

}


global.bot = new Wechaty()
.on('scan',    onScan)
.on('login',   onLogin)
.on('logout',  onLogout)
.on('message', onMessage)
.on('ready', function(){
  console.log('ready event ')
} )
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

var port = process.env.PORT || 80;

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});

module.exports = app;
