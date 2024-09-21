module.exports = Slash({
    name: 'greet',
    description: 'Greets a user.',
    schema: Schema(
        Optional(Str, 'there')
    ),
    execute: (msg, args) => {
        msg.send(`Hello, ${args[0]}!`);
    }
});