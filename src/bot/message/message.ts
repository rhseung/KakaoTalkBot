import { DateTime } from "../../DateTime";
import { AudioChat, Channel, Chat, DirectChannel, EmoticonChat, FeedChat, FileChat, MapChat, MultiChannel, MultiPhotoChat, NormalChat, OldEmoticonChat, OpenChannel, OpenDirectChannel, OpenMultiChannel, PhotoChat, ProfileChat, ReplyChat, User } from "../../../kakao_modules/db-manager/classes";
import { AudioAttach, ChannelCommon, ChatType, EmoticonComplex, FileAttach, MapAttach, MentionListAttach, MultiPhotoAttach, OldEmoticonAttach, OpenLinkType, PhotoAttach, ProfileAttach, ReplyAttach, VideoAttach } from "../../../kakao_modules/db-manager/types";
import { ReactClient } from "../../kakao-react/client/react-client";
import { ReactionType } from "../../kakao-react/type";
import { KakaoShareClient, PromiseLike, ResponseWrapper, SendType, Template } from "../../kakaolink";
import { Exception } from "../../utils";

export const ReactionMap = {
    'cancel': ReactionType.CANCEL,
    'heart': ReactionType.HEART,
    'like': ReactionType.LIKE,
    'check': ReactionType.CHECK,
    'laugh': ReactionType.LAUGH,
    'surprise': ReactionType.SURPRISE,
    'sad': ReactionType.SAD
} as const;

// TODO: replyMessage 등 FeedMessage 아닌 다른 Message 들도 만들어야 함

export class Message<C extends Chat> {
    constructor(
        protected _chat: C,
        protected _channel: Channel,
        protected reactClient: ReactClient,
        protected kakaolinkClient: KakaoShareClient,
        protected useKakaolink: boolean
    ) {}

    get text(): string {
        return this.chat.text;
    }

    get chat(): C {
        return this._chat;
    }

    get prevMessage(): Message<Chat> | null {
        const prevChat = this.chat.getPrevChat();
        if (prevChat === null) return null;

        return new Message(prevChat, this.channel, this.reactClient, this.kakaolinkClient, this.useKakaolink);
    }

    get nextMessage(): Message<Chat> | null {
        const nextChat = this.chat.getNextChat();
        if (nextChat === null) return null;

        return new Message(nextChat, this.channel, this.reactClient, this.kakaolinkClient, this.useKakaolink);
    }

    get channel(): Channel {
        return this._channel;
    }
    
    get user(): User {
        return this.chat.user;
    }

    get unreadMembers(): User[] {
        return this.chat.unreadMembers;
    }

    get readMembers(): User[] {
        return this.chat.readMembers;
    }

    get mentions(): User[] {
        // TODO: attachment 사용해서 좀 더 자세한 정보를 줄 수 있게 하자
        return this.chat.mentions;
    }

    get sentAt(): DateTime {
        return DateTime.fromDate(this.chat.sendTime);
    }

    get id(): { chat: bigint; channel: bigint } {
        return { chat: BigInt(this.chat.id), channel: BigInt(this.channel.id) };
    }

    get raw(): ChatType<number, any> {
        return this.chat.raw;
    }

    get originType(): number {
        return this.chat.originType;
    }

    get attachment(): (AudioAttach | EmoticonComplex | OldEmoticonAttach | FileAttach | MapAttach | PhotoAttach | MultiPhotoAttach | ProfileAttach | ReplyAttach | VideoAttach) & Partial<MentionListAttach> {
        return this.chat.attachment;
    }

    toJSON(): {
        chat: {
            chat: ChatType<number, any>;
            user: User;
            channel: Channel | null;
        },
        channel: {
            channel: ChannelCommon;
            openLink: null | OpenLinkType;
        } 
    } {
        return {
            chat: this.chat.toJSON(),
            channel: this.channel.toJSON()
        };
    }
    
    send(message: string): Promise<boolean>;
    send(template: Template & { sendType?: SendType }): PromiseLike<ResponseWrapper>;
    send(arg: string | (Template & { sendType?: SendType })): Promise<boolean> | PromiseLike<ResponseWrapper> {
        if (typeof arg === 'string') {
            return this.channel.send(arg);
        } else {
            if (!this.useKakaolink) {
                throw new Exception(
                    'Kakaolink is not enabled',
                    "Please set 'jsAppKey' and 'webPlatformDomain' when creating the bot"
                );
            }

            return this.kakaolinkClient.sendLink(this.channel.id, arg, arg.sendType ?? 'custom');
        }
    }

    react(type: ReactionType): Record<string, string>;
    react(type: keyof typeof ReactionMap): Record<string, string>;
    react(type: ReactionType | keyof typeof ReactionMap): Record<string, string> {
        if (typeof type === 'string') {
            return this.react(ReactionMap[type]);
        }

        // FIXME: linkId 가 이걸 말하는게 맞나? 그리고 왜 배열이여야하지?
        if (this.channel.isOpenChannel())
            return this.reactClient.react(this.channel.id, this.chat.id, type, [this.channel.openChannel.id]);
        else
            return this.reactClient.react(this.channel.id, this.chat.id, type);
    }

    isShout(): boolean {
        return this.chat.hasShout();
    }

    isDeleted(): boolean {
        return this.chat.isDeleted();
    }

    isEmoticon(): this is { chat: EmoticonChat } {
        return this.chat.isEmoticon();
    }

    isOldEmoticon(): this is { chat: OldEmoticonChat } {
        return this.chat.isOldEmoticon();
    }

    isFeed(): this is { chat: FeedChat } {
        return this.chat.isFeed();
    }

    isPhoto(): this is { chat: PhotoChat } {
        return this.chat.isPhoto();
    }

    isMultiPhoto(): this is { chat: MultiPhotoChat } {
        return this.chat.isMultiPhoto();
    }

    isNormalChat(): this is { chat: NormalChat } {
        return this.chat.isNormal();
    }

    isReply(): this is { chat: ReplyChat } {
        return this.chat.isReply();
    }

    isFile(): this is { chat: FileChat } {
        return this.chat.isFile();
    }

    isVideo(): this is { chat: FileChat } {
        return this.chat.isVideo();
    }

    isAudio(): this is { chat: AudioChat } {
        return this.chat.isAudio();
    }

    isMap(): this is { chat: MapChat } {
        return this.chat.isMap();
    }

    isProfile(): this is { chat: ProfileChat } {
        return this.chat.isProfile();
    }

    isGroupChannel(): boolean {
        return this.channel.isGroupChannel();
    }

    isOpenChannel(): this is { channel: OpenChannel } {
        return this.channel.isOpenChannel();
    }

    isMultiChannel(): this is { channel: MultiChannel } {
        return this.channel.isMultiChannel();
    }

    isDirectChannel(): this is { channel: DirectChannel } {
        return this.channel.isDirectChannel();
    }

    isOpenMultiChannel(): this is { channel: OpenMultiChannel } {
        return this.channel.isOpenMultiChannel();
    }

    isOpenDirectChannel(): this is { channel: OpenDirectChannel } {
        return this.channel.isOpenDirectChannel();
    }
}