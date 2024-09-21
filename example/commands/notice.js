module.exports = Slash({
    name: '공지',
    description: 'send a notice',
    schema: [
        Choice('정보부', '행사부', '총무부', '홍보부', '기획부', '기술부', '디자인부', '운영부', '기타부'),
        Choice('공지', '안내'),
        Optional(Rest(Annotated(Int, v => 39 <= v && v <= 41)), [39, 40, 41])
            .fallback('학년을 입력해주세요.', chat => {
                // 아무말
                let a = 4 + chat.text.length;
                return a;
            }),
        Rest(Str)
            .fallback('공지 내용을 입력해주세요.')
    ],
    execute: (msg, [department, _, grades, content]) => {
        grades.forEach(grade => {
            studentRooms[grade].send(`[ ${department} 공지 ]\n${content}`);
        });
    }
});