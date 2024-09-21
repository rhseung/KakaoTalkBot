module.exports = Slash({
    name: 'unban',
    description: 'Unbans a user.',
    schema: Schema(
        Mention
    ),
    execute: (msg, [unbannedUser]) => {
        unbannedUser.unban();
        msg.send(`Unbanned ${unbannedUser}.`);
    }
});