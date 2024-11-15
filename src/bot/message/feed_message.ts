import { Channel, Chat, DeleteFeed, DemoteFeed, FeedChat, HandOverFeed, InviteFeed, KickedFeed, LeaveFeed, MemberTypeChangedFeed, OpenChatJoinedFeed, OpenChatKickedFeed, PromoteFeed, User } from "../../../kakao_modules/db-manager/classes";
import { FeedAttach, FeedUser } from "../../../kakao_modules/db-manager/types";
import { ReactClient } from "../../kakao-react/client/react-client";
import { KakaoShareClient } from "../../kakaolink";
import { Message } from "./message";

export class FeedMessage<C extends FeedChat> extends Message<C> {
    constructor(
        chat: C,
        channel: Channel,
        reactClient: ReactClient,
        kakaolinkClient: KakaoShareClient,
        useKakaolink: boolean
    ) {
        super(chat, channel, reactClient, kakaolinkClient, useKakaolink);
    }

    get feedType(): number {
        return this.chat.feedType;
    }

    get feedContent(): string | FeedAttach {
        return this.chat.message;
    }

    isFeed(): this is FeedMessage<C> {
        return this.chat.isFeed();
    }

    isInviteMessage(): this is InviteMessage {
        return this.chat.isInviteFeed();
    }

    isLeaveMessage(): this is LeaveMessage {
        return this.chat.isLeaveFeed();
    }

    isOpenChatJoinMessage(): this is OpenChatJoinedMessage {
        return this.chat.isOpenChatJoinFeed();
    }

    isOpenChatKickedMessage(): this is OpenChatKickedMessage {
        return this.chat.isOpenChatKickedFeed();
    }
    
    isMasterChangedMessage(): this is MasterChangedMessage {
        return this.chat.isHandOverFeed();
    }

    isManagerAddedMessage(): this is ManagerAddedMessage {
        return this.chat.isPromoteFeed();
    }
    
    isManagerRemovedMessage(): this is ManagerRemovedMessage {
        return this.chat.isDemoteFeed();
    }
    
    isDeleteMessage(): this is DeleteMessage {
        return this.chat.isDeleteFeed();
    }
}

export class InviteMessage extends FeedMessage<InviteFeed> {
    constructor(
        chat: InviteFeed,
        channel: Channel,
        reactClient: ReactClient,
        kakaolinkClient: KakaoShareClient,
        useKakaolink: boolean
    ) {
        super(chat, channel, reactClient, kakaolinkClient, useKakaolink);
    }

    get invitees(): FeedUser[] {
        return this.chat.invitedUsers;
    }

    get inviter(): FeedUser {
        return this.chat.inviteUser;
    }
}

export class OpenChatJoinedMessage extends FeedMessage<OpenChatJoinedFeed> {
    constructor(
        chat: OpenChatJoinedFeed,
        channel: Channel,
        reactClient: ReactClient,
        kakaolinkClient: KakaoShareClient,
        useKakaolink: boolean
    ) {
        super(chat, channel, reactClient, kakaolinkClient, useKakaolink);
    }

    get joinUsers(): FeedUser[] {
        return this.chat.joinUsers;
    }
}

export class KickedMessage<C extends KickedFeed> extends FeedMessage<C> {
    constructor(
        chat: C,
        channel: Channel,
        reactClient: ReactClient,
        kakaolinkClient: KakaoShareClient,
        useKakaolink: boolean
    ) {
        super(chat, channel, reactClient, kakaolinkClient, useKakaolink);
    }

    isOpenChat(): this is OpenChatKickedMessage {
        return this.chat.isOpenChat();
    }
}

export class LeaveMessage extends KickedMessage<LeaveFeed> {
    constructor(
        chat: LeaveFeed,
        channel: Channel,
        reactClient: ReactClient,
        kakaolinkClient: KakaoShareClient,
        useKakaolink: boolean
    ) {
        super(chat, channel, reactClient, kakaolinkClient, useKakaolink);
    }

    get leaveUser(): FeedUser {
        return this.chat.leaveUser;
    }

    isHideExit(): boolean {
        return this.chat.isHideExit();
    }

    isKicked(): boolean | undefined {
        return this.chat.isKicked();
    }
}

export class OpenChatKickedMessage extends KickedMessage<OpenChatKickedFeed> {
    constructor(
        chat: OpenChatKickedFeed,
        channel: Channel,
        reactClient: ReactClient,
        kakaolinkClient: KakaoShareClient,
        useKakaolink: boolean
    ) {
        super(chat, channel, reactClient, kakaolinkClient, useKakaolink);
    }

    get kickedUser(): FeedUser {
        return this.chat.kickedUser;
    }

    get kickedBy(): User {
        return this.chat.kickedBy;
    }

    isOpenChat(): this is { chat: OpenChatKickedFeed } {
        return this.chat.isOpenChat();
    }
}

export class MemberTypeChangedMessage<C extends MemberTypeChangedFeed> extends FeedMessage<C> {
    constructor(
        chat: C,
        channel: Channel,
        reactClient: ReactClient,
        kakaolinkClient: KakaoShareClient,
        useKakaolink: boolean
    ) {
        super(chat, channel, reactClient, kakaolinkClient, useKakaolink);
    }

    isManagerAdded(): this is { chat: PromoteFeed } {
        return this.chat.isPromote();
    }

    isManagerRemoved(): this is { chat: DemoteFeed } {
        return this.chat.isDemote();
    }

    isMasterChanged(): this is { chat: HandOverFeed } {
        return this.chat.isHandover();
    }
}

export class ManagerAddedMessage extends MemberTypeChangedMessage<PromoteFeed> {
    constructor(
        chat: PromoteFeed,
        channel: Channel,
        reactClient: ReactClient,
        kakaolinkClient: KakaoShareClient,
        useKakaolink: boolean
    ) {
        super(chat, channel, reactClient, kakaolinkClient, useKakaolink);
    }

    get newManager(): FeedUser {
        return this.chat.promoteUser;
    }

    isManagerAdded(): this is { chat: PromoteFeed } {
        return this.chat.isPromote();
    }
}

export class ManagerRemovedMessage extends MemberTypeChangedMessage<DemoteFeed> {
    constructor(
        chat: DemoteFeed,
        channel: Channel,
        reactClient: ReactClient,
        kakaolinkClient: KakaoShareClient,
        useKakaolink: boolean
    ) {
        super(chat, channel, reactClient, kakaolinkClient, useKakaolink);
    }

    get removedManager(): FeedUser {
        return this.chat.demoteUser;
    }

    isManagerRemoved(): this is { chat: DemoteFeed } {
        return this.chat.isDemote();
    }
}

export class MasterChangedMessage extends MemberTypeChangedMessage<HandOverFeed> {
    constructor(
        chat: HandOverFeed,
        channel: Channel,
        reactClient: ReactClient,
        kakaolinkClient: KakaoShareClient,
        useKakaolink: boolean
    ) {
        super(chat, channel, reactClient, kakaolinkClient, useKakaolink);
    }

    get prevMaster(): FeedUser {
        return this.chat.prevHost;
    }

    get newMaster(): FeedUser {
        return this.chat.newHost;
    }

    isMasterChanged(): this is { chat: HandOverFeed } {
        return this.chat.isHandover();
    }
}

export class DeleteMessage extends FeedMessage<DeleteFeed> {
    constructor(
        chat: DeleteFeed,
        channel: Channel,
        reactClient: ReactClient,
        kakaolinkClient: KakaoShareClient,
        useKakaolink: boolean
    ) {
        super(chat, channel, reactClient, kakaolinkClient, useKakaolink);
    }

    get deletedMessage(): Message<Chat> {
        return new Message(this.chat.deletedChat, this.channel, this.reactClient, this.kakaolinkClient, this.useKakaolink);
    }
}