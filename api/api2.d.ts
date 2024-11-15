// @ts-ignore
declare const importPackage: (...pkgs: (android | androidx | java | javax)[]) => any;
// @ts-ignore
declare const importClass: (...pkgs: (android | androidx | java | javax)[]) => any;

declare namespace App {
    export function getContext(): android.content.Context;

    export function runOnUiThread(task: Function, onComplete: (error, result) => void): void;
}

declare class Bot {
    setCommandPrefix(prefix: string): void;

    send(room: string, message: string, packageName?: string): boolean;

    canReply(room: string, packageName?: string): boolean;

    getName(): string;

    setPower(power: boolean): void;

    getPower(): boolean;

    compile(): void;

    unload(): void;

    on<E extends keyof MessengerBotEventMap>(eventName: E, listener: MessengerBotEventMap[E]): void;

    addListener<E extends keyof MessengerBotEventMap>(eventName: E, listener: MessengerBotEventMap[E]): void;

    off<E extends keyof MessengerBotEventMap>(eventName: E, listener?: MessengerBotEventMap[E]): void;

    removeListener<E extends keyof MessengerBotEventMap>(eventName: E, listener?: MessengerBotEventMap[E]): void;

    removeAllListeners<E extends keyof MessengerBotEventMap>(eventName: E): void;

    prependListener<E extends keyof MessengerBotEventMap>(eventName: E, listener: MessengerBotEventMap[E]): void;

    listeners<E extends keyof MessengerBotEventMap>(eventName: E): MessengerBotEventMap[E][];

    markAsRead(room?: string, packageName?: string): boolean;
}

declare namespace BotManager {
    export function getCurrentBot(): Bot;

    export function getBot(botName: string): Bot;

    export function getRooms(packageName?: string): string[];

    export function getBotList(): Bot[];

    export function getPower(botName: string): boolean;

    export function setPower(botName: string, power: boolean): void;

    export function compile(botName: string, throwOnError?: boolean = false): boolean;

    export function compileAll(): void;

    export function prepare(scriptName: string, throwOnError?: boolean = false): 0 | 1 | 2;

    export function prepare(throwOnError?: boolean = false): number;

    export function isCompiled(scriptName: string): boolean;

    export function unload(): void;

}

declare namespace Broadcast {
    export function send(broadcastName: string, value: any): void;

    export function register(broadcastName: string, task: (value: any) => void): void;

    export function unregister(broadcastName: string, task: (value: any) => void): void;

    export function unregisterAll(): void;
}

declare namespace Database {
    export function exists(fileName: string): boolean;

    export function readObject(fileName: string): object;

    export function readString(fileName: string): string;

    export function writeObject(fileName: string, obj: object): void;

    export function writeString(fileName: string, str: string): void;
}

declare namespace Device {
    export function getBuild(): android.os.Build;

    export function getAndroidVersionCode(): number;

    export function getAndroidVersionName(): string;

    export function getPhoneBrand(): string;

    export function getPhoneModel(): string;

    export function isCharging(): boolean;

    export function getPlugType(): 'ac' | 'usb' | 'wireless' | 'unknown';

    export function getBatteryLevel(): number;

    export function getBatteryHealth()
        : typeof android.os.BatteryManager.BATTERY_HEALTH_UNKNOWN | typeof android.os.BatteryManager.BATTERY_HEALTH_GOOD |
        typeof android.os.BatteryManager.BATTERY_HEALTH_OVERHEAT | typeof android.os.BatteryManager.BATTERY_HEALTH_DEAD |
        typeof android.os.BatteryManager.BATTERY_HEALTH_OVER_VOLTAGE | typeof android.os.BatteryManager.BATTERY_HEALTH_UNSPECIFIED_FAILURE |
        typeof android.os.BatteryManager.BATTERY_HEALTH_COLD;

    export function getBatteryTemperature(): number;

    export function getBatteryVoltage(): number;

    export function getBatteryStatus()
        : typeof android.os.BatteryManager.BATTERY_STATUS_UNKNOWN | typeof android.os.BatteryManager.BATTERY_STATUS_CHARGING |
        typeof android.os.BatteryManager.BATTERY_STATUS_DISCHARGING | typeof android.os.BatteryManager.BATTERY_STATUS_NOT_CHARGING |
        typeof android.os.BatteryManager.BATTERY_STATUS_FULL;

    export function getBatteryIntent(): android.content.Intent;

    export function acquireWakeLock(param1: number, param2: string): void;
}

declare namespace Event {
    export namespace Activity {
        export const BACK_PRESSED = 'activityBackPressed';
        export const CREATE = 'activityCreate';
        export const DESTROY = 'activityDestroy';
        export const PAUSE = 'activityPause';
        export const RESTART = 'activityRestart';
        export const RESUME = 'activityResume';
        export const START = 'activityStart';
        export const STOP = 'activityStop';
    }

    /** @deprecated not implemented yet */
    export const TICK = 'tick';
    export const START_COMPILE = 'startCompile';
    export const NOTIFICATION_POSTED = 'notificationPosted';
    export const MESSAGE = 'message';
    export const COMMAND = 'command';
}

declare namespace FileStream {
    export function read(path: string): string;

    export function write(path: string, data: string): string;

    export function append(path: string, data: string): string;

    export function remove(path: string): boolean;
}

declare namespace GlobalLog {
    export function d(data: string, showToast: boolean = false): void;

    export function debug(data: string, showToast: boolean = false): void;

    export function e(data: string, showToast: boolean = false): void;

    export function error(data: string, showToast: boolean = false): void;

    export function i(data: string, showToast: boolean = false): void;

    export function info(data: string, showToast: boolean = false): void;

    export function clear(): void;
}

declare namespace Http {
    export function request(url: string, callback: (error: java.lang.Exception, response: org.jsoup.Connection.Response, doc: org.jsoup.nodes.Document) => void): void;

    export function request(option: {
        url: string,
        timeout?: number,
        method?: 'GET' | 'POST' = 'GET',
        headers?: Record<string, string>,
    }, callback: (error: java.lang.Exception, response: org.jsoup.Connection.Response, doc: org.jsoup.nodes.Document) => void): void;

    export function requestSync(url: string): org.jsoup.nodes.Document;

    export function requestSync(option: {
        url: string,
        timeout?: number = 3000,
        method?: 'GET' | 'POST' = 'GET',
        headers?: Record<string, string>,
    }): org.jsoup.nodes.Document;   
}

declare namespace Log {
    export function d(data: string, showToast: boolean = false): void;

    export function debug(data: string, showToast: boolean = false): void;

    export function e(data: string, showToast: boolean = false): void;

    export function error(data: string, showToast: boolean = false): void;

    export function i(data: string, showToast: boolean = false): void;

    export function info(data: string, showToast: boolean = false): void;

    export function clear(): void;
}

declare namespace Security {
    /**
     * 특정 값을 AES 복호화한 값을 반환합니다.
     * 
     * @param key - AES 복호화를 위한 키
     * @param initVector - 초기화 벡터
     * @param value - 복호화할 값
     * @returns 복호화된 문자열
     */
    export function aesDecode(key: string, initVector: string, value: string): string;

    /**
     * 특정 값을 AES 암호화한 값을 반환합니다.
     * 
     * @param key - AES 암호화를 위한 키
     * @param initVector - 초기화 벡터
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function aesEncode(key: string, initVector: string, value: string): string;

    /**
     * 특정 값을 ARIA 복호화한 값을 반환합니다.
     * 
     * @param key - ARIA 복호화를 위한 키
     * @param value - 복호화할 값
     * @returns 복호화된 문자열
     */
    export function ariaDecode(key: string, value: string): string;

    /**
     * 특정 값을 ARIA 암호화한 값을 반환합니다.
     * 
     * @param key - ARIA 암호화를 위한 키
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function ariaEncode(key: string, value: string): string;

    /**
     * 특정 값을 Base32 복호화한 값을 반환합니다.
     * 
     * @param value - 복호화할 값
     * @returns 복호화된 문자열
     */
    export function base32Decode(value: string): string;

    /**
     * 특정 값을 Base32 암호화한 값을 반환합니다.
     * 
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function base32Encode(value: string): string;

    /**
     * 특정 값을 Base64 복호화한 값을 반환합니다.
     * 
     * @param value - 복호화할 값
     * @returns 복호화된 문자열
     */
    export function base64Decode(value: string): string;

    /**
     * 특정 값을 Base64 암호화한 값을 반환합니다.
     * 
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function base64Encode(value: string): string;

    /**
     * 특정 값을 DES 복호화한 값을 반환합니다.
     * 
     * @param key - DES 복호화를 위한 키
     * @param value - 복호화할 값
     * @returns 복호화된 문자열
     */
    export function desDecode(key: string, value: string): string;

    /**
     * 특정 값을 DES 암호화한 값을 반환합니다.
     * 
     * @param key - DES 암호화를 위한 키
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function desEncode(key: string, value: string): string;

    /**
     * DES 보조키를 생성하여 반환합니다.
     * 
     * @returns 생성된 DES 보조키
     */
    export function desKey(): string;

    /**
     * 특정 값을 DES3 복호화한 값을 반환합니다.
     * 
     * @param key - DES3 복호화를 위한 키
     * @param value - 복호화할 값
     * @returns 복호화된 문자열
     */
    export function des3Decode(key: string, value: string): string;

    /**
     * 특정 값을 DES3 암호화한 값을 반환합니다.
     * 
     * @param key - DES3 암호화를 위한 키
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function des3Encode(key: string, value: string): string;

    /**
     * 특정 값을 ECC 복호화한 값을 반환합니다.
     * 
     * @param key - ECC 복호화를 위한 키
     * @param value - 복호화할 값
     * @returns 복호화된 문자열
     */
    export function eccDecode(key: string, value: string): string;

    /**
     * 특정 값을 ECC 암호화한 값을 반환합니다.
     * 
     * @param key - ECC 암호화를 위한 키
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function eccEncode(key: string, value: string): string;

    /**
     * 특정 값의 해시코드를 반환합니다.
     * 
     * @param value - 해시코드를 추출할 값
     * @returns 해시코드 값
     */
    export function hashCode(value: string): string;

    /**
     * 특정 값을 MD2 암호화한 값을 반환합니다.
     * 
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function md2(value: string): string;

    /**
     * 특정 값을 MD5 암호화한 값을 반환합니다.
     * 
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function md5(value: string): string;

    /**
     * 특정 값을 RC4 복호화한 값을 반환합니다.
     * 
     * @param key - RC4 복호화를 위한 키
     * @param value - 복호화할 값
     * @returns 복호화된 문자열
     */
    export function rc4Decode(key: string, value: string): string;

    /**
     * 특정 값을 RC4 암호화한 값을 반환합니다.
     * 
     * @param key - RC4 암호화를 위한 키
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function rc4Encode(key: string, value: string): string;

    /**
     * 특정 값을 SEED 복호화한 값을 반환합니다.
     * 
     * @param key - SEED 복호화를 위한 키
     * @param value - 복호화할 값
     * @returns 복호화된 문자열
     */
    export function seedDecode(key: string, value: string): string;

    /**
     * 특정 값을 SEED 암호화한 값을 반환합니다.
     * 
     * @param key - SEED 암호화를 위한 키
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function seedEncode(key: string, value: string): string;

    /**
     * 특정 값을 SHA 암호화한 값을 반환합니다.
     * 
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function sha(value: string): string;

    /**
     * 특정 값을 SHA256 암호화한 값을 반환합니다.
     * 
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function sha256(value: string): string;

    /**
     * 특정 값을 SHA384 암호화한 값을 반환합니다.
     * 
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function sha384(value: string): string;

    /**
     * 특정 값을 SHA512 암호화한 값을 반환합니다.
     * 
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function sha512(value: string): string;

    /**
     * 특정 값을 SHA3-224 암호화한 값을 반환합니다.
     * 
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function sha3_224(value: string): string;

    /**
     * 특정 값을 SHA3-256 암호화한 값을 반환합니다.
     * 
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function sha3_256(value: string): string;

    /**
     * 특정 값을 SHA3-384 암호화한 값을 반환합니다.
     * 
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function sha3_384(value: string): string;

    /**
     * 특정 값을 SHA3-512 암호화한 값을 반환합니다.
     * 
     * @param value - 암호화할 값
     * @returns 암호화된 문자열
     */
    export function sha3_512(value: string): string;
}

declare class SessionManager {
    bindSession(packageName: string, room: string, action?: android.app.Notification.Action): boolean;

    bindSession(room: string, action?: android.app.Notification.Action): boolean;
}

type Msg = {
    room: string,
    channelId: bigint,
    content: string,
    isGroupChat: boolean,
    isDebugRoom: boolean,
    image: {
        getBase64: () => string,
        getBitmap: () => android.graphics.Bitmap
    },
    isMention: boolean,
    logId: bigint,
    author: {
        name: string,
        avatar: {
            getBase64: () => string,
            getBitmap: () => android.graphics.Bitmap
        },
        hash: string,
    },
    reply: (content: string) => void,
    markAsRead: () => void,
    packageName: string
};

interface MessengerBotEventMap {
    activityBackPressed: (activity: android.app.Activity) => void;
    activityCreate: (activity: android.app.Activity) => void;
    activityDestroy: (activity: android.app.Activity) => void;
    activityPause: (activity: android.app.Activity) => void;
    activityRestart: (activity: android.app.Activity) => void;
    activityResume: (activity: android.app.Activity) => void;
    activityStart: (activity: android.app.Activity) => void;
    activityStop: (activity: android.app.Activity) => void;
    tick: () => void;
    startCompile: () => void;
    notificationPosted: (sbn: android.service.notification.StatusBarNotification, sm: SessionManager) => void;
    message: (msg: Msg) => void;
    command: (msg: Msg & { command: string, args: string[] }) => void;
}

declare const require: (module: string) => any;
declare const global: () => any;

export declare interface API2 {
    importPackage: typeof importPackage;
    importClass: typeof importClass;
    App: typeof App;
    Bot: typeof Bot;
    BotManager: typeof BotManager;
    Broadcast: typeof Broadcast;
    Database: typeof Database;
    Device: typeof Device;
    Event: typeof Event;
    FileStream: typeof FileStream;
    GlobalLog: typeof GlobalLog;
    Http: typeof Http;
    Log: typeof Log;
    Security: typeof Security;
    SessionManager: typeof SessionManager;
    require: typeof require;
    global: typeof global;
}
