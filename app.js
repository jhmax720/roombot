var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
const { Wechaty } = require('wechaty')

const Weishangs = require('./models/Weishang');

var mongoose = require('mongoose');

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/autoClicker', { useNewUrlParser: true })
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

async function onLogin (user) {
  console.log(`${user} login~`)
  
  // try { 
  //   await user.signature(`Signature changed by wechaty on ${new Date()}`)
  // } catch (e) {
  //   console.error('change signature failed', e)
  // }
  console.log(user);
}

function onLogout(user) {
  console.log(`${user} logout`)
}

async function onMessage (msg) {
   var contact = msg.from();
   var room = msg.room();
   if(room)
   {
    var topic = await room.topic()
   }
   
  if(!contact.name() )
  {
    await contact.sync()
  }
  
  if(msg.text() && msg.text().length>=40 && topic && contact.name()!='') 
  {

    let promise = new Promise((resolve, reject) => {
      Weishangs.findOne({topic: topic}).then(aRoom=>{
        if(aRoom)
        {
          if(!aRoom.members.includes(contact.name()))
          {
            aRoom.members.push(contact.name());
            aRoom.save().then(data => { resolve(data)}).catch(err => {console.log(err); reject();});
          }
          
        }
        else{
          var newRoom = new Weishangs(
            {
              topic: topic,
              members: [contact.name()],
              created: new Date(),
              updated:new Date()

            }
          )
          newRoom.save().then(data => { resolve(data)}).catch(err => {console.log(err); reject();}); 
        }
      });

      // Headcount.findOne({ name: contact.name()  }).then((ahc) =>{
      //   if(ahc)
      //   {
      //     ahc.count++;
  
      //     if(!ahc.topics.includes(topic))
      //     {
      //       ahc.topics.push(topic);
      //     }
  
      //     ahc.save().then(data => { resolve(data)}).catch(err => {console.log(err); reject();});
      //   }
      //   else{
      //     var newhc = new Headcount(
      //       {
      //         name: contact.name(),
      //         count:1,
      //         topics: [topic]
      //       }
      //     );
        
      //     newhc.save().then(data => { resolve(data)}).catch(err => {console.log(err); reject();});
      //   }
  
      // })


    });

    await promise;
  

   
  }

  // if(contact.friend())
  // {
  //   console.log('found a friend!');
  //   if(msg.text() == 'change my name')
  //   {
  //     console.log('changing alias')
  //     try {
  //       await contact.alias('aaa-001')
  //       console.log(`change ${contact.name()}'s alias successfully!`)
  //     } catch (e) {
  //       console.log(`failed to change ${contact.name()} alias!`)
  //     }
  //   }
  // }

}


global.bot = new Wechaty()
.on('scan',    onScan)
.on('login',   onLogin)
.on('logout',  onLogout)
.on('message', onMessage)
.on('friendship', async friendship => {
  try {
    console.log(`received friend event.`)
    switch (friendship.type()) {

    // 1. New Friend Request

    case Friendship.Type.Receive:
      await friendship.accept()
      break

    // 2. Friend Ship Confirmed

    case Friendship.Type.Confirm:
      console.log(`friend ship confirmed`)
      break
    }
  } catch (e) {
    console.error(e)
  }
})
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

var port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});

module.exports = app;
