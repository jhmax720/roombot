
var FileBox = require('file-box');
var express = require('express');
var router = express.Router();
const { Wechaty } = require('wechaty')
const Localjobs = require('.././models/Localjob');

const globalAdText = '【房地产推荐<img class="emoji emoji1f3e1" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">】<br>这里是墨尔本H&amp;T华信公司地产投资顾问Cotica Wei. 专业的为您讲解墨尔本房地产知识以及专业的根据您的预算为您做资产配置。如果您想了解相应的地产项目 海内外贷款 投资理念。 可以随时联系我。 扫描下方二维码 或者 添加微信号 13604823472。';
const globalImagePath = './images/1.jpg';

const sleep = (milliseconds) => {
  return new Promise(async resolve => setTimeout(resolve, milliseconds), (err)=>{
    console.log('sleep error: '+  err);
  })
}

async function delayedMessage(room) {
  if (room.payload.topic) {
    console.log('processed room: ' + room.payload.topic)        
    
    await sleep(3000).then(() => {

      return new Promise(async (resolve, reject) => { // <--- this line
        try {
          await room.say(globalAdText);
          return resolve();
        } catch (error) {
          return reject(error);
        }
      }).catch((err)=>{
        console.log('handle reject: ' +err);
      });
    });

    await sleep(500).then(() => {

      return new Promise(async (resolve, reject) => { // <--- this line
        try {
          const fileBox2 = FileBox.FileBox.fromFile(globalImagePath)      
          await room.say(fileBox2);
          return resolve();
        } catch (error) {
          return reject(error);
        }
      }).catch((err)=>{
        console.log('handle reject: ' +err);
      });;
    });

    

    // const contactCard = await bot.Contact.find({alias: 'Cotica- H&T  Melbourne'})
    // await room.say(contactCard)
  }
  else {
    console.log('unable to process room: ' + room.payload.topic)
  }

}


async function initRoom() {
  console.log('begin to initRoom!')
  var maxCallAtempt = 2;
  var currentAttempt = 0;
  const MAX_ROOM_ = 80;

  var roomList = [];
  

  roomList = await bot.Room.findAll();

  while (roomList.length < MAX_ROOM_ && currentAttempt < maxCallAtempt) {
    
    console.warn(`room num not ready. retry after 5 seconds. room num: ${roomList.length}. current attempt: ${currentAttempt}`)
    await sleep(5000).then(() => {

      return new Promise(async (resolve, reject) => { // <--- this line
        try {
          roomList = await bot.Room.findAll();
          return resolve(roomList);
        } catch (error) {
          return reject(error);
        }
      });
    });
    currentAttempt++;
  }

  return roomList
}

async function broadcast() {

  var roomList = await initRoom();                   // get the room list of the bot
  console.log('room count: ' + roomList.length);
  var list = roomList.sort();
  for(var room of list)
  {
    await delayedMessage(room);
  }


  //console.log('current index: ' + msgsentCount);

  
  //const promises = roomList.map(delayedMessage);
  // wait until all promises are resolved
  //await Promise.all(promises);




  console.log('Done!');



}
async function broadcastTest() {
  //const room = await bot.Room.find({ topic: 'test' });

  for (step = 0; step < 50; step++)
  {
    console.log(step);
    await delayedMessageErr();
  }
  
  // try {
  //   const contactCard2 = await bot.Contact.find({ name: 'Cotica- H&T  Melbourne' });
  //   var name = contactCard2.name()
  //   await room.say(contactCard2)
  // }
  // catch (err) {
  //   console.log(err);

  // }


}

router.post('/job', async function (req, res, next) {
 
  global.botWxRef = req.body.wxId;
  var fullUrl = req.protocol + '://' + req.get('host') ;//+ req.originalUrl;

  var selfId = bot.userSelf();
  var botName = selfId.name()
   Localjobs.deleteMany({ $or:[{name:botName}, {botWxRef:global.botWxRef}] }).then(jobs =>{
      console.log('old jobs deleleted');
      var nJob = new Localjobs(
        {
            name: botName,
            botWxRef: botWxRef,
            url: fullUrl,
            jobType: 0
        }
      )
      nJob.save().then(data => {
        res.send('ok');
      }).catch(err => {console.log(err); reject();}); 
   });


});

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render('index', { title: '群发助手', qrcode: wechatyQr });
});
router.post('/rooms', async function (req, res, next) {
  var all = await initRoom();

  const results = all.map(async (obj) => { return await obj.topic(); });
  // document.writeln( `Before waiting: ${results}`);
  
  Promise.all(results).then((completed) => 
  {
    res.send(completed);
  }
  );

  
});

router.get('/me', async function (req, res, next) {

  var selfId = bot.userSelf();


  console.log(selfId.payload.id + ' ' + selfId.name() + ' ' );
  console.log(selfId);
 
  var value = selfId.payload.weixin;
  if(!value || value == '')
  {
    value = selfId.payload.id;
  }

  res.send( {wxRef: value, name: selfId.name()});
});

router.post('/members', async function (req, res, next) {
  var aTopic = req.body.topic;
  console.log(aTopic);
  const room = await bot.Room.find({ topic: aTopic });

  if (room) {

    //console.log(room)
    console.log('getting the room members')
    var allMembers = await room.memberAll();
    //console.log(allMembers )
    var results = [];
    for (var aMember of allMembers) {
      results.push(
        //wxid: aMember.payload.id,
        aMember.name()
        //gender: aMember.gender(),
        //province: aMember.province(),
        //city: aMember.city(),
        //weixin:aMember.weixin(),
        //signature: aMember.payload.signature
      )
    }

    res.send(results)

  }
  else{
    res.send([])
  }
});

router.post('/fansToAdd', async function (req, res, next) {
      
});

router.post('/poke', async function (req, res, next) {
  const room = await bot.Room.find({ topic: 'test' });
  //var contactCard = await bot.Contact.find({ alias: 'MyBeauty' }) // change 'lijiarui' to any of the room member


  //await room.add(contactCard);
  if(room)
  {
    var allMembers = await room.memberAll();

    for(var member of allMembers)
    {
      if(!member.friend())
      {
        await bot.Friendship.add(member, 'Nice to meet you! I am wechaty bot!')

      }
      //await member.sync();
      // if(member.city())
      // {
      //   console.log(member.name()) ;
      //   console.log(member.province()) ;
      //   console.log(member.city()) ;  
      // }

    }

 

  }

  res.send('completed')

})
router.post('/text', async function (req, res, next) {
  var aTopic = req.body.topic;
  var aMsg = req.body.content;
  const room = await bot.Room.find({ topic: aTopic});
  if(room)
  {
    try
    {
      console.log('sending txt to ' + aTopic);
      await room.say(aMsg);
    }
    catch(err)
    {
      console.log('error sending iamge ' + err);
    }
    
  }
  else
  {
    console.log('unable to find room' + aTopic);
  }

  res.send('done');

});

router.post('/msgTest', async function (req, res, next) {
  //var id = req.body.id;
  var aMsg = req.body.content;
 // var somebody =  await bot.Contact.load(id);

  somebody = await bot.Contact.find({name:"CA海外同城-墨尔本站2"}) 
  if(somebody)
  {
    console.log('sending txt to ' + somebody.name());
    await somebody.say(aMsg);
  }
  
 

  res.send('done');

});

router.get('/friends', async function (req, res, next) {

  const contactList = await bot.Contact.findAll()
  console.log(contactList.length + ' contacts found');

  var friendList = [];
  contactList.forEach(contact => {
    if (contact.friend() && contact.type() == bot.Contact.Type.Personal) {
      //console.log('found a friend ' + contact.name())
      friendList.push(contact);
    }
    else {
      //console.log('found a stranger ' + contact.name())
    }
  });

  //const friendList = contactList.filter(contact => !!contact.friend())
  var friends = friendList.map(x => ({
    wxid: x.payload.id,
    name: x.name(),
    gender: x.gender(),
    province: x.province(),
    city: x.city()

  }));

  res.send(friends)
});

router.post('/image', async function (req, res, next) {
  var aTopic = req.body.topic;
  var imagePath = req.body.content;
  const room = await bot.Room.find({ topic: aTopic});
  var returnMsg = 'done';
  
  if(room)
  {

    try
    {
      console.log('sending image to ' + aTopic);
      const fileBox = FileBox.FileBox.fromFile(imagePath)      
      await room.say(fileBox);
    }
    catch(err)
    {
      returnMsg = aTopic + '- error sending iamge ' + err;
      console.log(returnMsg);
    }
    
  }
  else
  {
    console.log('unable to find room' + aTopic);
  }


  res.send(returnMsg);

});


module.exports = router;
