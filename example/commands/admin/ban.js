module.exports = Slash({
    name: 'ban',
    description: 'Bans a user.',
    schema: Schema(
        Mention,
        Optional(Str, 'No reason provided.')
    ),
    execute: (msg, [bannedUser, reason]) => {
        bannedUser.ban();
        msg.send(`Banned ${bannedUser} for ${reason}.`);
    }
});