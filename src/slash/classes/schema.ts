import { Message } from "../../bot/message/message"
import { Chat, User } from "../../../kakao_modules/db-manager/classes";
import { FloatType, IntType, MentionType, StrType, Type } from "../typing";

export class SchemaType {
    constructor(private types: Type<any>[]) {}

    processMentions<C extends Chat>(msg: Message<C>): (string | User)[] {
        const text = msg.text;
        const mentions = msg.mentions;
        const attachment = msg.attachment;

        const mentionLengths: number[] = [];
        attachment.mentions?.forEach(m => m.at.forEach(index => mentionLengths[index - 1] = +m.len));

        const args: (string | User)[] = [];

        for (
            let now = 0, start = 0, mentionIdx = 0;
            now <= text.length;
            now++
        ) {
            if ((text[now] === " " || now === text.length) && text[start] === "@") {
                if (now - (start + 1) === mentionLengths[mentionIdx]) {
                    args.push(mentions[mentionIdx++]);
                    start = now + 1;
                }
            } else if (text[now] === " " || now === text.length) {
                args.push(text.substring(start, now));
                start = now + 1;
            }
        }

        return args.filter(arg => arg !== "");
    }

    isValid<C extends Chat>(msg: Message<C>): boolean {
        const text = msg.text;
        const args = this.processMentions<C>(msg);

        for (let i = 0; i < this.types.length; i++) {
            const type = this.types[i];

            switch (type.constructor) {
                case IntType:
                case FloatType:
                case StrType:
                    if (!type.isValid(args[i] as string))
                        return false;
                    break;
                case MentionType:
                    -
            }
        }
    }
}

export function Schema(...types: Type<any>[]): SchemaType {
    return new SchemaType(types);
}