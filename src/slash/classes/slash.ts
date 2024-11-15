import { Message } from "../../bot/message/message";
import { Chat } from "../../../kakao_modules/db-manager/classes";
import { SchemaType } from "./schema";

export type CommandOpt<C extends Chat = Chat> = {
    name?: string,
    description?: string,
    schema: SchemaType,
    execute: (msg: Message<C>, args: any[]) => void
}

export class SlashCommand<C extends Chat = Chat> {
    name: string;
    description: string;
    schema: SchemaType;
    execute: (msg: Message<C>, args: any[]) => void;

    constructor(options: CommandOpt<C>) {
        this.name = options.name ?? '';
        this.description = options.description ?? '';
        this.schema = options.schema;
        this.execute = options.execute;
    }

    help(): string {
        // TODO: help 메소드 구현
        return `Command: ${this.name}\nDescription: ${this.description}\nUsage: ${this.schema.usage}`;
    }
}

export function Slash<C extends Chat = Chat>(options: CommandOpt<C>) {
    return new SlashCommand(options);
}