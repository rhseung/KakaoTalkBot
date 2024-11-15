import { KakaoTalkBot, ReactionType, Events, Slash, Schema, Int } from "../src";

const bot = KakaoTalkBot.create(this);

bot.on(Events.COMMAND, (msg, command) => {
    msg.channel
    msg.chat

    msg.send('hello world!')
        .then(console.log)
        .catch(console.error);

    msg.react(ReactionType.CANCEL);
    msg.react('check');

    msg.send({
        'templateArgs': {},
        'templateId': 3333
    });

    msg.mentions

    msg.send('hello world!');
});

bot.on(Events.KICK, msg => {
    if (msg.isLeaveMessage()) {
        msg.leaveUser
    }
    else if (msg.isOpenChatKickedMessage()) {
        msg.kickedUser
    }
    else if (msg.isOpenChat()) {
        msg.kickedBy
    }
});

bot.once(Events.JOIN, msg => {});

bot.commandRoot = '/sdcard/msgbot/commands';

bot.commands.register({
    add: Slash({}),
    math: {
        sub: Slash({}),
        mul: Slash({}),
    }
})

bot.commands.register(Slash({
    'name': 'test',
    'description': 'test command',
    'schema': Schema(Int),
    'execute': (msg, [num]) => {
        msg.send(`Number: ${num}`);
    }
}));

bot.on(Events.MESSAGE, msg => {
    bot.runCommand(msg);
});