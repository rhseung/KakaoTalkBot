function getMeals(dt) {
    // ...
}

module.exports = Slash({
    name: '급식',
    description: '급식을 확인합니다.',
    schema: Schema(
        DateTime
    ),
    execute: (msg, [datetime]) => {
        msg.send(getMeals(datetime).join('\n\n'));
    }
});