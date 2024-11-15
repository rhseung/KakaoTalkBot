import { Channel, NormalChat } from "../../../kakao_modules/db-manager/classes";
import { ReactClient } from "../../kakao-react/client/react-client";
import { KakaoShareClient } from "../../kakaolink";
import { Message } from "./message";

export class NormalMessage extends Message<NormalChat> {
    constructor(
        chat: NormalChat,
        channel: Channel,
        reactClient: ReactClient,
        kakaolinkClient: KakaoShareClient,
        useKakaolink: boolean
    ) {
        super(chat, channel, reactClient, kakaolinkClient, useKakaolink);
    }

    isNormal(): this is NormalMessage {
        return this.chat.isNormal();
    }
}