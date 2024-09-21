import { Msg, SessionManager } from "../../../android/api2";
import { Channel, Chat, DeleteFeed, InviteFeed, LeaveFeed, MemberTypeChangedFeed, OpenChatJoinedFeed, OpenChatKickedFeed } from "../../db-manager/classes";
import { ChangeUserType } from "../../db-manager/types";
import { Message } from "../classes/message";

export enum Events {
    MESSAGE = 'message',
    DEBUG = 'debug',
    JOIN = 'join',
    INVITE = 'invite',
    LEAVE = 'leave',
    KICK = 'kick',
    DELETE = 'delete',
    HIDE = 'hide',
    MEMBER_TYPE_CHANGE = 'member_type_change',
    OPEN_PROFILE_CHANGE = 'open_profile_change',
    START_COMPILE = 'startCompile',
    NOTIFICATION_POSTED = 'notificationPosted',
    TICK = 'tick',
}

export interface EventMap {
    [Events.DEBUG]: (msg: Msg) => void;
    [Events.TICK]: () => void;
    [Events.START_COMPILE]: () => void;
    [Events.NOTIFICATION_POSTED]: (sbn: android.service.notification.StatusBarNotification, sm: SessionManager) => void;
    
    [Events.OPEN_PROFILE_CHANGE]: (beforeUser: ChangeUserType, afterUser: ChangeUserType, channel: Channel) => void;
    [Events.MESSAGE]: (msg: Message) => void;
    [Events.JOIN]: (msg: Message<OpenChatJoinedFeed>) => void;
    [Events.INVITE]: (msg: Message<InviteFeed>) => void;
    [Events.LEAVE]: (msg: Message<LeaveFeed>) => void;
    [Events.KICK]: (msg: Message<LeaveFeed | OpenChatKickedFeed>) => void;
    [Events.DELETE]: (msg: Message<DeleteFeed>) => void;
    [Events.HIDE]: (msg: Message) => void;
    [Events.MEMBER_TYPE_CHANGE]: (msg: Message<MemberTypeChangedFeed>) => void;
}