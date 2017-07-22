const Botkit = require('./node_modules/botkit/lib/Botkit.js');

//===========================
const TOKEN = "your api token";
//===========================

const Reply = {
  all: ['direct_message','direct_mention','mention'],
  direct_message: 'direct_message',
  mention: 'mention',
  direct_mention: 'direct_mention',
  mentionAll: ['mention', 'direct_mention']
};


const controller = Botkit.slackbot({
  debug: true
});

const bot = controller.spawn({ token: TOKEN })
    .startRTM(err => {
      if (err) throw new Error(err);
    });

controller.on('rtm_close', (bot, err) => { throw new Error('rtm_closed;')});


// =======================================
const map = {
  'hello': 'world',
  'hoge': 'piyo',
  'l': 'llll'
};
//========================================


const keys = Object.keys(map);


controller.hears(keys, Reply.all, (bot, message) => {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: '+1',
  });
  bot.reply(message, map[message.text]);
});





controller.hears('ask', Reply.all, (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    convo.addQuestion('犬派ですか? Say YES or NO.', [
      {
        pattern: bot.utterances.yes,
        callback: function(response, convo) {
          convo.say('だよね！');
          convo.next();
        }
      },{
        pattern: bot.utterances.no,
        callback: function(response, convo) {
          convo.say('へー');
          convo.next();
        }
      }, {
        default: true,
        callback: function (response, convo) {
          convo.say(':thinking_face: YES or NO で答えてね');
          convo.repeat();
          convo.next();
        }
      }
    ],{},'default')
  });
});
