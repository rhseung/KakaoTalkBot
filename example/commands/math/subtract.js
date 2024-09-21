module.exports = Slash({
    name: 'subtract',
    description: 'Subtracts numbers',
    schema: Schema(
        Rest(Int)
    ),
    execute: (msg, args) => {
        msg.send(`The difference is ${args.reduce((a, b) => a - b)}.`);
    }
});