(function() {
    const telegramBot = require('node-telegram-bot-api');
    const {config} = require('../config/config.js');
    const models = require('../models');
    const CommandParser = require('./commandParser.js');
    const Message = require('./message.js');

    const token = config.token || process.argv[2];
    let bot = new telegramBot(token, {polling: true});
    let commandParser = new CommandParser(bot);
    bot.getMe().then(function (me) {
        bot.me = me;
    });

    models.sequelize.sync().then(function () {
        console.log('DB Initialisation successfull');
        process.on('exit', exitHandler);
        process.on('SIGINT', exitHandler);
        process.on('uncaughtException', exitHandler);

        if (process.argv[2] == "learn") {
            var rl = require('readline').createInterface({
                input: require('fs').createReadStream(process.argv[3])
            });
        
            rl.on('line', function (line, lineCount, byteCount) {
                /* console.log(lineCount, line, byteCount); */
                var raw_msg = JSON.parse(line);
                var chat = {id: -1001097268620, type: 'supergroup', title: 'АСВК'};
                var user = {id: raw_msg.from_id, is_bot: raw_msg.sent_by_bot, first_name: raw_msg.author, username: raw_msg.author};
                var msg = {message_id: raw_msg.message_id, from: user, date: Date.parse(raw_msg.date)/1000, chat: chat, text: raw_msg.content, learn: true}
                try {
                    new Message(bot, msg).process();
                } catch (e) {
                    console.log(e);
                }
            })
            .on('close', function() {
            })
            .on('error', function (e) {
                console.log("error", e);
            });
        } else {
            bot.on('message', onNewMessage);
        }
    }, function (error) {
        console.log(error);
    });

    function onNewMessage(msg) {
        if (commandParser.isCommand(msg)) {
            commandParser.process(msg);
        } else {
            try {
                new Message(bot, msg).process();
            } catch (e) {
                console.log(e);
            }
        }
    }

    function exitHandler() {
        models.sequelize.close();
        process.exit(0);
    }
})();
