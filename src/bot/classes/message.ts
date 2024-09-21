import { Channel, Chat } from "../db-manager/classes";
import { ReactClient } from "../kakao-react/client/react-client";
import { ReactionType } from "../kakao-react/type";
import { KakaoShareClient } from "../kakaolink/api/kakao-share-client";
import { PromiseLike } from "../kakaolink/asynchronous";
import { ResponseWrapper } from "../kakaolink/request";
import { SendType, Template } from "../kakaolink/template";

export const ReactionMap = {
    'cancel': ReactionType.CANCEL,
    'heart': ReactionType.HEART,
    'like': ReactionType.LIKE,
    'check': ReactionType.CHECK,
    'laugh': ReactionType.LAUGH,
    'surprise': ReactionType.SURPRISE,
    'sad': ReactionType.SAD
} as const;

export class Message<C extends Chat = Chat> {
    constructor(
        private _chat: C,
        private _channel: Channel,
        private reactClient: ReactClient,
        private kakaolinkClient: KakaoShareClient,
        private useKakaolink: boolean
    ) {}

    get chat(): C {
        return this._chat;
    }

    get channel(): Channel {
        return this._channel;
    }
    
    send(message: string): Promise<boolean>;
    send(template: Template & { sendType?: SendType }): PromiseLike<ResponseWrapper>;
    send(arg: string | (Template & { sendType?: SendType })): Promise<boolean> | PromiseLike<ResponseWrapper> {
        if (typeof arg === 'string') {
            return this.channel.send(arg);
        } else {
            if (!this.useKakaolink)
                throw new Error('Kakaolink is not enabled');

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
}