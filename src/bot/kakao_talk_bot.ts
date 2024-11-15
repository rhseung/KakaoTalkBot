import { KakaoAuthJacker } from "../kakao-react/kakao_auth_jacker";
import { ReactClient } from "../kakao-react/client/react-client";
import { DBManager } from "../../kakao_modules/db-manager/DBManager/DBManager";
import { InstanceType } from "../../kakao_modules/db-manager/types";
import { AllConfig, AuthorizeConfig, KakaoTalkConfig } from "../kakao-react/config";
import { KakaoApiService } from "../kakaolink/api/kakao-api-service";
import { KakaoShareClient } from "../kakaolink/api/kakao-share-client";
import { CronJob } from "../cronjob/cron-job-manager";
import { API2, Bot } from "../../android/api2";
import { CommandTree } from "../slash/classes/command_tree";
import { EventEmitter, Events } from "./event";
import { Message } from "./message";
import { Chat } from "../../kakao_modules/db-manager/classes";
import { setIntervalFixed, clearTimer } from "../utils";

type Global = API2;
type CronJobType = typeof CronJob;
type KakaolinkInitForm = {
    jsAppKey: string,
    webPlatformDomain: string
};

export class KakaoTalkBot extends EventEmitter {
    protected timer: number;

    private constructor(
        protected global: Global,
        originalBot: Bot,
        protected packageName: string,
        protected cronjob: CronJobType,
        protected jacker: KakaoAuthJacker,
        reactClient: ReactClient,
        dbManager: DBManager,
        useKakaolink: boolean,
        protected kakaolinkService: KakaoApiService | undefined,
        kakaolinkClient: KakaoShareClient | undefined,
        protected commandRootDir: java.io.File,
        protected commandTree: CommandTree,
    ) {
        super(originalBot, dbManager, reactClient, kakaolinkClient, useKakaolink);

        // 자동 시작
        this.start();
        this.timer = setIntervalFixed(() => this.emit(Events.TICK), 1000);  // TEST: tick event 구현 잘 되는지 테스트
        this.on(Events.START_COMPILE, () => { this.stop(); clearTimer(this.timer); });
        this.on(Events.NOTIFICATION_POSTED, (sbn, _) => this.dbManager.addChannel(sbn));
    }

    static create(
        global: Global,
        config: InstanceType & AllConfig & Partial<AuthorizeConfig> & Partial<KakaolinkInitForm> = {}
    ): KakaoTalkBot {
        let originalBot = global.BotManager.getCurrentBot();
        let packageName = config.packageName ?? 'com.kakao.talk';  

        // cronjob
        let cronjob = CronJob;

        // db-manager
        let dbManager = DBManager.getInstance({
            packageName,
            ...(config.userID !== undefined && { userID: config.userID }),
            ...(config.isRoot !== undefined && { isRoot: config.isRoot }),
            ...(config.reactByMine !== undefined && { reactByMine: config.reactByMine })
        });

        // kakao-react
        let jacker = new KakaoAuthJacker(packageName);
        let reactClient = ReactClient.create({
            accessToken: config.accessToken ?? jacker.accessToken(),
            deviceUUID: config.deviceUUID ?? jacker.deviceUUID()
        }, {
            kakaotalkVersion: config.kakaotalkVersion ?? KakaoTalkConfig.kakaotalkVersion,
            okhttpVersion: config.okhttpVersion ?? KakaoTalkConfig.okhttpVersion
        });

        // kakaolink
        let useKakaolink = config.jsAppKey !== undefined && config.webPlatformDomain !== undefined;
        let kakaolinkService: KakaoApiService | undefined = undefined;
        let kakaolinkClient: KakaoShareClient | undefined = undefined;

        if (useKakaolink) {
            kakaolinkService = KakaoApiService.createService();
            kakaolinkClient = KakaoShareClient.createClient();

            let cookies = kakaolinkService.login({
                signInWithKakaoTalk: true,
                context: global.App.getContext()
            }).awaitResult();

            kakaolinkClient.init(config.jsAppKey!!, config.webPlatformDomain!!, cookies);
        }

        // command
        let commandRootDir = new java.io.File('/sdcard/msgbot/commands');
        let commandTree = (commandRootDir.exists() && commandRootDir.isDirectory())
            ? CommandTree.fromDirectory(commandRootDir) : new CommandTree();
        
        return new KakaoTalkBot(
            global,
            originalBot,
            packageName,
            cronjob,
            jacker,
            reactClient,
            dbManager,
            useKakaolink,
            kakaolinkService,
            kakaolinkClient,
            commandRootDir,
            commandTree
        );
    }

    get commandRoot(): java.io.File {
        return this.commandRootDir;
    }

    set commandRoot(path: string) {
        this.commandRootDir = new java.io.File(path);
        this.commandTree = CommandTree.fromDirectory(this.commandRootDir);
    }

    get commands(): CommandTree {
        return this.commandTree;
    }

    runCommand<C extends Chat>(msg: Message<C>) {
        this.commands.run(msg, this);
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
}