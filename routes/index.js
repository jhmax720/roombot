

var express = require('express');
var router = express.Router();
const { Wechaty } = require('wechaty')


async function broadcast() {
  const roomList = await bot.Room.findAll()                    // get the room list of the bot

  console.log('current index: ' + msgsentCount);
  roomList.forEach(x => {

    if(x.payload.topic && x.payload.topic.toLowerCase().indexOf('mybeauty') === -1)
    {

      if(x.payload.topic.toLowerCase().includes('testing'))
      {
        console.log(x);
        //x.say('<img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">墨尔本东区美容院，三月特价新鲜出炉啦～<br>一，韩式半永久眉毛$250，美瞳线仅需$200！美甲纯色仅30<br>二，胸部乳腺疏通原价$398/次，本月仅需$158！<br>三，秘制祛痘疗程，原价$1980/8次现$1200/8次（我们是包去掉痘痘，无效全额🙈退款）<br>四，台式嫁接睫毛，本月仅$88/次（保证你的睫毛又长又浓密）<br>五，肩颈理疗SPA—养生系宝可以来感受，原价$398，本月仅$128！<br>六，韩国进口水光针原价$760/次，本月仅$280！做一次维持大半年～<br>有兴趣的宝宝➕微信预约啦～只要你来问都给你优惠价！<img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">');
        x.say('1');
      }
      
    }
    //if(x.to)
    
    //x.say('<img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">墨尔本东区美容院，三月特价新鲜出炉啦～<br>一，韩式半永久眉毛$250，美瞳线仅需$200！美甲纯色仅30<br>二，胸部乳腺疏通原价$398/次，本月仅需$158！<br>三，秘制祛痘疗程，原价$1980/8次现$1200/8次（我们是包去掉痘痘，无效全额🙈退款）<br>四，台式嫁接睫毛，本月仅$88/次（保证你的睫毛又长又浓密）<br>五，肩颈理疗SPA—养生系宝可以来感受，原价$398，本月仅$128！<br>六，韩国进口水光针原价$760/次，本月仅$280！做一次维持大半年～<br>有兴趣的宝宝➕微信预约啦～只要你来问都给你优惠价！<img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif"><img class="emoji emoji1f389" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif">');
  })
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
      catch{
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
