module.exports = Slash({
    name: 'add',
    description: 'Adds numbers',
    schema: Schema(
        Rest(Int)
    ),
    execute: (msg, args) => {
        msg.send(`The sum is ${args.reduce((a, b) => a + b, 0)}.`);
    }
});