import { KakaoAuthJacker } from "../kakao-react/kakao_auth_jacker";
import { ReactClient } from "../kakao-react/client/react-client";
import { DBManager } from "../db-manager/DBManager/DBManager";
import { ChangeUserType, InstanceType } from "../db-manager/types";
import { AllConfig, AuthorizeConfig, KakaoTalkConfig } from "../kakao-react/config";
import { KakaoApiService } from "../kakaolink/api/kakao-api-service";
import { KakaoShareClient } from "../kakaolink/api/kakao-share-client";
import { CronJob } from "../cronjob/cron-job-manager";
import { API2, Bot, Msg } from "../../android/api2";
import { EventMap, Events } from "./event/event";
import { Message } from "./classes/message";
import { Channel, Chat } from "../db-manager/classes";

type Global = API2;
type CronJobType = typeof CronJob;
type KakaolinkInitForm = {
    jsAppKey: string,
    webPlatformDomain: string
};

export class KakaoTalkBot {
    private global: Global;
    private originalBot: Bot;
    private packageName: string;
    private cronjob: CronJobType;
    private jacker: KakaoAuthJacker;
    private reactClient: ReactClient;
    private dbManager: DBManager;
    private useKakaolink: boolean;
    private kakaolinkService: KakaoApiService;
    private kakaolinkClient: KakaoShareClient;

    private constructor(global: Global, config: InstanceType & AllConfig & Partial<AuthorizeConfig> & Partial<KakaolinkInitForm> = {}) {
        this.global = global;
        this.originalBot = this.global.BotManager.getCurrentBot();
        this.packageName = config.packageName ?? 'com.kakao.talk';

        // cronjob
        this.cronjob = CronJob;

        // db-manager
        this.dbManager = DBManager.getInstance({
            packageName: this.packageName,
            ...(config.userID !== undefined && { userID: config.userID }),
            ...(config.isRoot !== undefined && { isRoot: config.isRoot }),
            ...(config.reactByMine !== undefined && { reactByMine: config.reactByMine })
        });

        // kakao-react
        this.jacker = new KakaoAuthJacker(this.packageName);
        this.reactClient = ReactClient.create({
            accessToken: config.accessToken ?? this.jacker.accessToken(),
            deviceUUID: config.deviceUUID ?? this.jacker.deviceUUID()
        }, {
            kakaotalkVersion: config.kakaotalkVersion ?? KakaoTalkConfig.kakaotalkVersion,
            okhttpVersion: config.okhttpVersion ?? KakaoTalkConfig.okhttpVersion
        });

        // kakaolink
        this.useKakaolink = config.jsAppKey !== undefined && config.webPlatformDomain !== undefined;
        if (this.useKakaolink) {
            this.kakaolinkService = KakaoApiService.createService();
            this.kakaolinkClient = KakaoShareClient.createClient();

            this.kakaolinkClient.init(config.jsAppKey!!, config.webPlatformDomain!!, this.kakaolinkService.login({
                signInWithKakaoTalk: true,
                context: this.global.App.getContext()
            }).awaitResult());
        }
    }

    static create(global: Global, config: InstanceType & AllConfig & Partial<AuthorizeConfig> & Partial<KakaolinkInitForm> = {}): KakaoTalkBot {
        const bot = new KakaoTalkBot(global, config);

        bot.start();
        bot.on(Events.START_COMPILE, () => bot.stop());
        bot.on(Events.NOTIFICATION_POSTED, (sbn, _) => bot.dbManager.addChannel(sbn));

        return bot;
    }

    start() {
        this.dbManager.start();
        this.cronjob.setWakeLock(true);
    }

    stop() {
        this.dbManager.stop();
        this.cronjob.setWakeLock(false);
        this.cronjob.off();
    }

    addListener<E extends keyof EventMap>(eventName: E, listener: EventMap[E]): void {
        switch (eventName) {
            case Events.DEBUG:
            case Events.TICK:
            case Events.START_COMPILE:
            case Events.NOTIFICATION_POSTED:
                this.originalBot.addListener(eventName === Events.DEBUG ? 'message' : eventName, listener as (...args: any[]) => void);
                break;
            case Events.OPEN_PROFILE_CHANGE:
                this.dbManager.addListener(eventName, listener as (beforeUser: ChangeUserType, afterUser: ChangeUserType, channel: Channel) => void);
                break;
            default:
                this.dbManager.addListener(eventName, (chat: Chat, channel: Channel) => {
                    (listener as (msg: Message<any>) => void)(new Message(chat, channel, this.reactClient, this.kakaolinkClient, this.useKakaolink));
                });
        }
    }

    on<E extends keyof EventMap>(eventName: E, listener: EventMap[E]): void {
        return this.addListener(eventName, listener);
    }

    once<E extends keyof EventMap>(eventName: E, listener: EventMap[E]): void {
        // TODO: once를 구현하려면 listener(); 후에 removeListener를 호출해야 함. 근데 once listener들은 한 번 사용되면 삭제되는건가? 아니면 가만히 있는건가? 이건 dbmanager로 listenerCount로 테스트해봐야함
        
        switch (eventName) {
            case Events.DEBUG:
            case Events.TICK:
            case Events.START_COMPILE:
            case Events.NOTIFICATION_POSTED:
                throw new Error(`Cannot use once method with ${eventName} event`);
                break;
            case Events.OPEN_PROFILE_CHANGE:
                this.dbManager.addListener(eventName, listener as (beforeUser: ChangeUserType, afterUser: ChangeUserType, channel: Channel) => void);
                break;
            default:
                this.dbManager.addListener(eventName, (chat: Chat, channel: Channel) => {
                    (listener as (msg: Message<any>) => void)(new Message(chat, channel, this.reactClient, this.kakaolinkClient, this.useKakaolink));
                });
        }
    }

    prependListener<E extends keyof EventMap>(eventName: E, listener: EventMap[E]): void {
        switch (eventName) {
            case Events.DEBUG:
            case Events.TICK:
            case Events.START_COMPILE:
            case Events.NOTIFICATION_POSTED:
                this.originalBot.prependListener(eventName === Events.DEBUG ? 'message' : eventName, listener as (...args: any[]) => void);
                break;
            case Events.OPEN_PROFILE_CHANGE:
                this.dbManager.prependListener(eventName, listener as (beforeUser: ChangeUserType, afterUser: ChangeUserType, channel: Channel) => void);
                break;
            default:
                this.dbManager.prependListener(eventName, (chat: Chat, channel: Channel) => {
                    (listener as (msg: Message<any>) => void)(new Message(chat, channel, this.reactClient, this.kakaolinkClient, this.useKakaolink));
                });
        }
    }

    prependOnceListener<E extends keyof EventMap>(eventName: E, listener: EventMap[E]): void {
        switch (eventName) {
            case Events.DEBUG:
            case Events.TICK:
            case Events.START_COMPILE:
            case Events.NOTIFICATION_POSTED:
                throw new Error(`Cannot use prependOnceListener method with ${eventName} event`);
                break;
            case Events.OPEN_PROFILE_CHANGE:
                this.dbManager.addListener(eventName, listener as (beforeUser: ChangeUserType, afterUser: ChangeUserType, channel: Channel) => void);
                break;
            default:
                this.dbManager.addListener(eventName, (chat: Chat, channel: Channel) => {
                    (listener as (msg: Message<any>) => void)(new Message(chat, channel, this.reactClient, this.kakaolinkClient, this.useKakaolink));
                });
        }
    }

    removeListener<E extends keyof EventMap>(eventName: E, listener: EventMap[E]): void {
        switch (eventName) {
            case Events.DEBUG:
            case Events.TICK:
            case Events.START_COMPILE:
            case Events.NOTIFICATION_POSTED:
                this.originalBot.removeListener(eventName === Events.DEBUG ? 'message' : eventName, listener as (...args: any[]) => void);
                break;
            case Events.OPEN_PROFILE_CHANGE:
                this.dbManager.removeListener(eventName, listener as (beforeUser: ChangeUserType, afterUser: ChangeUserType, channel: Channel) => void);
                break;
            default:
                this.dbManager.removeListener(eventName, (chat: Chat, channel: Channel) => {
                    (listener as (msg: Message<any>) => void)(new Message(chat, channel, this.reactClient, this.kakaolinkClient, this.useKakaolink));
                });
        }
    }

    off<E extends keyof EventMap>(eventName: E, listener: EventMap[E]): void {
        return this.removeListener(eventName, listener);
    }

    removeAllListeners<E extends keyof EventMap>(eventName?: E): void {
        if (eventName === undefined) {
            this.originalBot.removeAllListeners('message');
            this.dbManager.removeAllListeners();
        }
        else {
            switch (eventName) {
                case Events.DEBUG:
                case Events.TICK:
                case Events.START_COMPILE:
                case Events.NOTIFICATION_POSTED:
                    this.originalBot.removeAllListeners(eventName === Events.DEBUG ? 'message' : eventName);
                    break;
                case Events.OPEN_PROFILE_CHANGE:
                    this.dbManager.removeAllListeners(eventName);
                    break;
                default:
                    this.dbManager.removeAllListeners(eventName);
            }
        }
    }

    listeners<E extends keyof EventMap>(eventName: E): EventMap[E][] {
        switch (eventName) {
            case Events.DEBUG:
            case Events.TICK:
            case Events.START_COMPILE:
            case Events.NOTIFICATION_POSTED:
                return this.originalBot.listeners(eventName === Events.DEBUG ? 'message' : eventName) as EventMap[E][];
            default:
                return this.dbManager.listeners(eventName) as EventMap[E][];
        }
    }

    listenerCount<E extends keyof EventMap>(eventName: E): number {
        switch (eventName) {
            case Events.DEBUG:
            case Events.TICK:
            case Events.START_COMPILE:
            case Events.NOTIFICATION_POSTED:
                return this.originalBot.listeners(eventName === Events.DEBUG ? 'message' : eventName).length;
            default:
                return this.dbManager.listenerCount(eventName);
        }
    }

    emit<E extends keyof EventMap>(eventName: E, ...args: Parameters<EventMap[E]>): boolean {
        switch (eventName) {
            case Events.DEBUG:
            case Events.TICK:
            case Events.START_COMPILE:
            case Events.NOTIFICATION_POSTED:
                throw new Error(`Cannot use emit method with ${eventName} event`);
            case Events.OPEN_PROFILE_CHANGE:
                return this.dbManager.emit(eventName, ...args as [ChangeUserType, ChangeUserType, Channel]);
            default:
                const arg = args[0] as Message<any>;
                return this.dbManager.emit(eventName, arg.chat, arg.channel);
        }
    }
}