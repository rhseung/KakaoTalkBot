import { KakaoTalkBot } from "../../bot";
import { Message } from "../../bot/message";
import { Chat } from "../../../kakao_modules/db-manager/classes";
import { Exception } from "../../utils";
import { CommandOpt, SlashCommand } from "./slash";

type Tree<T> = { [key: string]: Tree<T> | T };

export class CommandTree {
    constructor(private slot: Tree<SlashCommand> = {}) {}

    private static _isTree(obj: any): obj is Tree<SlashCommand> {
        return typeof obj === 'object' && obj !== null;
    }

    private static _fromDirectory(dir: java.io.File, slot: Tree<SlashCommand>) {
        const files = dir.listFiles();

        for (const file of files) {
            const name = file.getName();

            if (file.isDirectory()) {
                slot[name] = {};
                this._fromDirectory(file, slot[name] as Tree<SlashCommand>);
            }
            else if (name.endsWith('.js')) {
                // @ts-ignore
                const command = require(file.getAbsolutePath());

                if (command instanceof SlashCommand) {
                    if (command.name === '')
                        command.name = name.slice(0, -3);
                    if (command.description === '')
                        command.description = 'No description';

                    slot[command.name] = command;
                }
                else {
                    throw new Exception(`Invalid command file: ${file.getAbsolutePath()}. It must export a SlashCommand instance.`, `using 'Slash' function to export command.`);
                }
            }
        }
    }

    private static _fromObject(obj: Tree<SlashCommand>, slot: Tree<SlashCommand>) {
        const keys = Object.keys(obj);

        for (const key of keys) {
            const name = String(key);
            const command = obj[key];

            if (this._isTree(command)) {
                slot[name] = {};
                this._fromObject(command, slot[name] as Tree<SlashCommand>);
            }
            else if (command instanceof SlashCommand) {
                if (command.name === '')
                    command.name = name.slice(0, -3);
                if (command.description === '')
                    command.description = 'No description';

                slot[command.name] = command;
            }
            else {
                throw new Exception(`Invalid command. It must export a SlashCommand instance.`, `using 'Slash' function to export command.`);
            }
        }
    }

    static fromDirectory(dir: java.io.File): CommandTree {
        if (!dir.isDirectory()) {
            throw new Error(`Expected directory, got file: ${dir}`);
        }

        const slot: Tree<SlashCommand> = {};
        this._fromDirectory(dir, slot);

        const tree = new CommandTree(slot);
        
        return tree;
    }

    static fromObject(obj: Tree<SlashCommand>): CommandTree {
        const slot: Tree<SlashCommand> = {};
        this._fromObject(obj, slot);

        const tree = new CommandTree(slot);
        
        return tree;
    }

    register(obj: SlashCommand | Tree<SlashCommand>): CommandTree {
        if (obj instanceof SlashCommand) {
            const slash = obj;
            const paths = slash.name.split('/');
            let slot = this.slot;

            paths.forEach((path, i) => {
                if (i === paths.length - 1) {
                    slash.name = path;
                    slot[path] = slash;
                }
                else {
                    slot[path] ??= {};
                    slot = slot[path] as Tree<SlashCommand>;
                }
            });
        }
        else {
            CommandTree._fromObject(obj, this.slot);
        }

        return this;
    }

    find(msg: Message<Chat>): { command: SlashCommand<Chat>, args: any[] } | null {
        const args = msg.chat.text.split(/ +/);
        let slot: Tree<SlashCommand> | SlashCommand = this.slot;

        let i = 0;
        let commandArgs: any[] = [];

        for (; i < args.length; i++) {
            const arg = args[i];

            if (CommandTree._isTree(slot)) {
                if (arg in slot)
                    slot = slot[arg];
                else
                    return null;
            }
            else {
                // TODO: schema validation
                if (valid)
                    return { command: slot, args: commandArgs };
                else
                    return null;
            }
        }

        // 명령어 인자가 아예 없어서 끊김 ex. /ping
        if (CommandTree._isTree(slot))
            return null;
        else
            return { command: slot, args: [] };;
    }

    run(msg: Message<Chat>, bot: KakaoTalkBot) {
        const found = this.find(msg);
        if (found === null) return;

        bot.emit('command', msg, found.command);
        found.command.execute(msg, found.args);
    }
}