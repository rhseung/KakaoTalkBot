import { KakaoTalkBot, ReactionType, Events } from "../src";

const bot = KakaoTalkBot.create(this);

bot.on(Events.MESSAGE, msg => {
    msg.channel
    msg.chat

    msg.send('hello world!')
        .then(console.log)
        .catch(console.error);

    msg.react(ReactionType.CANCEL);
    msg.react('laugh');

    msg.send({
        'templateArgs': {},
        'templateId': 3333
    });
});

bot.on(Events.DEBUG, msg => {
    msg.reply('debug message');
});

bot.commandRootDir = '/sdcard/msgbot/commands';

bot.commandRoot.push(Slash({
    name: 'uqefiuwf',
    description: 'ijwfoijwef',
    schema: [
        Int
    ],
    execute: (msg, [n]) => {
        msg.send(n);
    }
}));