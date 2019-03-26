
var FileBox = require('file-box');
var express = require('express');
var router = express.Router();
const { Wechaty } = require('wechaty')



async function delayedMessage(room) {
  if (room.payload.topic) {
    console.log('processed room: ' + room.payload.topic)
    await room.say('<img class="qqemoji qqemoji57" text="[Beer]_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="qqemoji qqemoji57" text="[Beer]_web" src="/zh_CN/htmledition/v2/images/spacer.gif">不想每天重复群发广告的小伙伴<img class="emoji emoji270c" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">加我我们为您免费推广<img class="emoji emoji270c" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><br>【每日无间断转发您的广告，数百本地群内推送】群类涵盖本土市场所有行业。<br>不管你是做餐饮<img class="emoji emoji1f43b" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">代购<img class="emoji emoji1f43b" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">化妆品<img class="emoji emoji1f43b" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">美容<img class="emoji emoji1f43b" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">微商<img class="emoji emoji1f43b" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">地产<img class="emoji emoji1f43b" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">金融<img class="emoji emoji1f43b" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">实体店<img class="emoji emoji1f43b" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">保证您的信息得到最精准的投放。<img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">');
    //await room.say('【房地产推荐<img class="emoji emoji1f3e1" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">】<br>这里是墨尔本H&amp;T华信公司地产投资顾问Cotica Wei. 专业的为您讲解墨尔本房地产知识以及专业的根据您的预算为您做资产配置。如果您想了解相应的地产项目 海内外贷款 投资理念。 可以随时联系我。 扫描下方二维码 或者 添加微信号 13604823472。');
    // const fileBox2 = FileBox.FileBox.fromFile('./images/1.jpg')      
    // await room.say(fileBox2);

    // const contactCard = await bot.Contact.find({alias: 'Cotica- H&T  Melbourne'})
    // await room.say(contactCard)
  }
  else {
    console.log('unable to process room: ' + room.payload.topic)
  }

}

async function initRoom() {
  console.log('begin to initRoom!')
  var maxCallAtempt = 10;
  var currentAttempt = 0;
  const MAX_ROOM_ = 60;

  var roomList = [];
  const sleep = (milliseconds) => {
    return new Promise(async resolve => setTimeout(resolve, milliseconds))
  }



  while (roomList.length < MAX_ROOM_) {
    console.warn(`room num not ready. retry after 10 seconds. room num: ${roomList.length}`)
    await sleep(10000).then(() => {

      return new Promise(async (resolve, reject) => { // <--- this line
        try {
          roomList = await bot.Room.findAll();
          return resolve(roomList);
        } catch (error) {
          return reject(error);
        }
      });
    });
  }

  return roomList
}

async function broadcast() {

  var roomList = await initRoom();                   // get the room list of the bot



  console.log('current index: ' + msgsentCount);

  console.log('room count: ' + roomList.length);
  const promises = roomList.map(delayedMessage);
  // wait until all promises are resolved
  await Promise.all(promises);




  console.log('Done!');



}
async function broadcastTest() {
  const room = await bot.Room.find({ topic: 'test' });
  // const fileBox2 = FileBox.FileBox.fromFile('./images/1.jpg')

  // await room.say(fileBox2);


  //const contactCard2 = await bot.Contact.find({name: 'Cotica- H&T  Melbourne'})
  ;
  try {
    const contactCard2 = await bot.Contact.find({ name: 'Cotica- H&T  Melbourne' });
    var name = contactCard2.name()
    await room.say(contactCard2)
  }
  catch (err) {
    console.log(err);

  }


}

/* GET home page. */
router.get('/', async function (req, res, next) {


  // bot.on('login', function(user){
  //   console.log(`${user} login~ from index`);
  //   //res.redirect('http://google.com');
  // })


  res.render('index', { title: '群发助手', qrcode: wechatyQr });
});

router.get('/fire', async function (req, res, next) {

  await broadcast();
  //await broadcastTest();

  // global.intervalSending = setInterval(async function () {

  //   if (msgsentCount <= 4) {
  //     try {
  //       await broadcast();
  //     }
  //     catch (err) {
  //       //DONT CARE
  //     }

  //     msgsentCount++;
  //   }
  //   else {
  //     clearInterval(global.intervalSending);
  //     msgsentCount = 0;
  //   }


  // }, 1800000 * 4);


  res.render('index', { title: '群发助手', message: '群发成功! 接下来助手还会连续发广告5次,每次间隔2个小时.请不要登出微信帐号' });
})
router.post('/invite', async function (req, res, next) {
  const room = await bot.Room.find({ topic: 'test' });
  var contactCard = await bot.Contact.find({ alias: 'MyBeauty' }) // change 'lijiarui' to any of the room member

  // for (var ar in allRooms) {
  //   try {
  //     await ar.add(contactCard)
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }
  await room.add(contactCard);

  res.send('completed')

})



module.exports = router;
