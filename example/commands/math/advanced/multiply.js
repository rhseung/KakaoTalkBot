module.exports = {
    name: 'multiply',
    description: 'Multiplies numbers',
    schema: Schema(
        Rest(Int)
    ),
    execute: (msg, args) => {
        msg.send(`The product is ${args.reduce((a, b) => a * b, 1)}.`);
    }
}