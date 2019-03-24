

var express = require('express');
var router = express.Router();
const { Wechaty } = require('wechaty')

async function delayedMessage(room)
{
  if(room.payload.topic && room.payload.topic.toLowerCase().indexOf('mybeauty') === -1)
  {
    console.log('processed room: '+ room.payload.topic)
    await room.say('<img class="emoji emoji1f338" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f44f" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">墨尔本东区美容院，三月特价新鲜出炉啦！<img class="emoji emoji1f338" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><br><img class="emoji emoji1f338" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">一，韩式半永久纹眉仅需$250，美瞳线仅$200！美甲纯色任选仅45<img class="emoji emoji1f485" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><br><img class="emoji emoji1f338" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">二，日式纯氧翘睫术—本月仅需$108，可维持40-60天。<br><img class="emoji emoji1f338" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">三，王牌项目“秘制祛痘”疗程，原价$1980/8次现$1200/8次（我们是包去掉痘痘，无效全额🙈退款）<br><img class="emoji emoji1f338" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">四，台式—嫁接睫毛，本月仅$88/次（保证你的睫毛又长又浓密哦～）<br><img class="emoji emoji1f338" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">五，产后修复SPA—养生系妈咪可以来体验—恢复少女身材，原价$398，本月仅$158！<br><img class="emoji emoji1f338" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">六，韩国进口—水光针原价$760/次，本月仅$280！做一次维持大半年！<br>有兴趣的宝宝➕微信预约啦～只要你来问都给你优惠价！<img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f338" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">');  
  }
  else
  {
    console.log('unable to process room: '+ room.payload.topic)
  }
  
}

async function initRoom() {
  console.log('begin to initRoom!')
  const roomList = await bot.Room.findAll()
  if (roomList.length < 100) {
    console.warn(`room num not ready. retry after 10 seconds. room num: ${roomList.length}`)
    setTimeout(initRoom, 10000)
    return
  }
  return roomList
}

async function broadcast() {
  const roomList = await initRoom();                   // get the room list of the bot

  console.log('current index: ' + msgsentCount);

  console.log('room count: '+ roomList.length);
  const promises = roomList.map(delayedMessage);
  // wait until all promises are resolved
  await Promise.all(promises);




  console.log('Done!');


  
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

  global.intervalSending = setInterval(async function () {

    if (msgsentCount <= 4) {
      try {
        await broadcast();
      }
      catch(err) {
        //DONT CARE
      }

      msgsentCount++;
    }
    else {
      clearInterval(global.intervalSending);
      msgsentCount = 0;
    }


  }, 1800000*4);


  res.render('index', { title: '群发助手', message: '群发成功! 接下来助手还会连续发广告5次,每次间隔2个小时.请不要登出微信帐号' });
})

module.exports = router;
