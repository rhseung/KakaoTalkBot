declare const importPackage: (...pkgs: (android | androidx | java | javax)[]) => any;
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

    on<E extends keyof EventMap>(eventName: E, listener: EventMap[E]): void;

    addListener<E extends keyof EventMap>(eventName: E, listener: EventMap[E]): void;

    off<E extends keyof EventMap>(eventName: E, listener?: EventMap[E]): void;

    removeListener<E extends keyof EventMap>(eventName: E, listener?: EventMap[E]): void;

    removeAllListeners<E extends keyof EventMap>(eventName: E): void;

    prependListener<E extends keyof EventMap>(eventName: E, listener: EventMap[E]): void;

    listeners<E extends keyof EventMap>(eventName: E): EventMap[E][];

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
        timeout?: number = 3000,
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
    // TODO: implement

    export function aesDecode(key: string, initVector: string, value: string): string;

    export function aesEncode(key: string, initVector: string, value: string): string;
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

interface EventMap {
    'activityBackPressed': (activity: android.app.Activity) => void;
    'activityCreate': (activity: android.app.Activity) => void;
    'activityDestroy': (activity: android.app.Activity) => void;
    'activityPause': (activity: android.app.Activity) => void;
    'activityRestart': (activity: android.app.Activity) => void;
    'activityResume': (activity: android.app.Activity) => void;
    'activityStart': (activity: android.app.Activity) => void;
    'activityStop': (activity: android.app.Activity) => void;
    'tick': () => void;
    'startCompile': () => void;
    'notificationPosted': (sbn: android.service.notification.StatusBarNotification, sm: SessionManager) => void;
    'message': (msg: Msg) => void;
    'command': (msg: Msg & { command: string, args: string[] }) => void;
}

declare const require: (module: string) => any;
declare const global: () => any;

export interface API2 {
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
