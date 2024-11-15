import { Msg, SessionManager } from "../../../android/api2";
import { Channel, Chat, KickedFeed, MemberTypeChangedFeed } from "../../../kakao_modules/db-manager/classes";
import { ChangeUserType } from "../../../kakao_modules/db-manager/types";
import { SlashCommand } from "../../slash";
import { Message } from "../message/message";
import { DeleteMessage, InviteMessage, KickedMessage, LeaveMessage, MemberTypeChangedMessage, OpenChatJoinedMessage } from "../message/feed_message";

export type BotEventMap = {
    command: <C extends Chat>(msg: Message<C>, command: SlashCommand<C>) => void;
}

export const isBotEvent = (event: string): event is keyof BotEventMap => {
    return event === 'command';
}

export type VanillaEventMap = {
    debug: (msg: Msg) => void;
    /** @deprecated not implemented yet */ tick: () => void;
    startCompile: () => void;
    notificationPosted: (sbn: android.service.notification.StatusBarNotification, sm: SessionManager) => void;
}

export const isVanillaEvent = (event: string): event is keyof VanillaEventMap => {
    return event in ['debug', 'tick', 'startCompile', 'notificationPosted'];
}

export type DBEventMap = {
    message: <C extends Chat>(msg: Message<C>) => void;
    delete: (msg: DeleteMessage) => void;
    hide: <C extends Chat>(msg: Message<C>) => void;
    leave: (msg: LeaveMessage) => void;
    join: (msg: OpenChatJoinedMessage) => void;
    invite: (msg: InviteMessage) => void;
    kick: <C extends KickedFeed>(msg: KickedMessage<C>) => void;
    member_type_change: <C extends MemberTypeChangedFeed>(msg: MemberTypeChangedMessage<C>) => void;
}

export const isDBEvent = (event: string): event is keyof DBEventMap => {
    return event in ['message', 'delete', 'hide', 'leave', 'join', 'invite', 'kick', 'member_type_change'];
}

export type SpecialDBEventMap = {
    open_profile_change: (beforeUser: ChangeUserType, afterUser: ChangeUserType, channel: Channel) => void;
}

export const isSpecialDBEvent = (event: string): event is keyof SpecialDBEventMap => {
    return event === 'open_profile_change';
}

export type EventMap = VanillaEventMap & DBEventMap & SpecialDBEventMap & BotEventMap;

export enum Events {
    DEBUG = 'debug',
    TICK = 'tick',
    START_COMPILE = 'startCompile',
    NOTIFICATION_POSTED = 'notificationPosted',
    MESSAGE = 'message',
    DELETE = 'delete',
    HIDE = 'hide',
    LEAVE = 'leave',
    JOIN = 'join',
    INVITE = 'invite',
    KICK = 'kick',
    MEMBER_TYPE_CHANGE = 'member_type_change',
    OPEN_PROFILE_CHANGE = 'open_profile_change',
    COMMAND = 'command'
}