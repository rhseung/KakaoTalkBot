import { MentionAttach } from "../kakao_modules/db-manager/types";

class User {
    constructor(public name: string) {}

    toString() {
        return `User(${this.name})`;
    }
}

// @ts-ignore
let 학생회_봇: User = new User('학생회 봇');
// @ts-ignore
let 류현승: User = new User('류현승');

let mentions: User[] = [학생회_봇, 류현승, 학생회_봇];
let attachments: MentionAttach[] = [
    {
        "user_id": '405211838',
        "len": '5',
        "at": [1, 3]
    },
    {
        "user_id": '272751860',
        "len": '3',
        "at": [2]
    }
];

let lengths: number[] = [];
attachments.forEach(attachment => {
    attachment.at.forEach(index => {
        lengths[index - 1] = +attachment.len;
    });
});

console.log(lengths); // [5, 3, 5]

const text = "하이 하이 반갑다        @학생회 봇 아니 근데 진짜 별 일이 다 있긴 함 @류현승 ㅎㅇ @학생회 봇 ";
let tokens: (string | User)[] = [];

for (let now = 0, start = 0, mentionIdx = 0; now <= text.length; now++) {
    if (text[now] === '@') {
        tokens.push(text.slice(start, now));
        tokens.push(mentions[mentionIdx]);
        now += lengths[mentionIdx++] + 1;   // @ + mention + ' ' (멘션하면 자동으로 뒤에 공백 붙음)
        start = now + 1;
    }
    else if (now === text.length) {
        tokens.push(text.slice(start, now));
    }
}

// for (let now = 0, start = 0, mentionIdx = 0; now <= text.length; now++) {
//     if ((text[now] === ' ' || now === text.length) && text[start] === '@') {
//         if (now - (start + 1) === lengths[mentionIdx]) {
//             tokens.push(mentions[mentionIdx++]);
//             start = now + 1;
//         }
//     }
//     else if (text[now] === ' ' || now === text.length) {
//         tokens.push(text.substring(start, now));
//         start = now + 1;
//     }
// }

tokens = tokens.filter(token => token !== '');

console.log(tokens);

/** 
[
  '하이',
  User { name: '학생회 봇' },
  '아니',
  '근데',
  '진짜',
  '별',
  '일이',
  '다',
  '있긴',
  '함',
  User { name: '류현승' },
  'ㅎㅇ',
  User { name: '학생회 봇' },
  'ㅎㅇ'
]
 */
