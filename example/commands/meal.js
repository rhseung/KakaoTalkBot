function getMeals(dt) {
    // ...
}

module.exports = Slash
    .name('급식')
    .description('급식을 확인합니다.')
    .args(T.string().datetime(), T.number())
    .execute((msg,))