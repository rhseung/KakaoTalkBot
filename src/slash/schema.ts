import { Message } from "../bot/classes/message"

export class Schema {}

export type CommandOpt = {
    name?: string,
    description?: string,
    schema: Schema,
    execute: (msg: Message<any>, args: any[]) => void
}