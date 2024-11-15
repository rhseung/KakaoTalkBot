import { Bot, MessengerBotEventMap } from "../../../android/api2";
import { DBManager } from "../../../kakao_modules/db-manager";
import { Channel, Chat } from "../../../kakao_modules/db-manager/classes";
import { ReactClient } from "../../kakao-react/client/react-client";
import { KakaoShareClient } from "../../kakaolink";
import { Exception } from "../../utils";
import { Message } from "../message";
import { DBEventMap, SpecialDBEventMap, BotEventMap, VanillaEventMap, EventMap, isDBEvent, isBotEvent, isVanillaEvent,  isSpecialDBEvent } from "./event";
import { MessageEvents } from "../../../kakao_modules/db-manager/types";

class MaxListenersExceededException extends Exception {
    constructor(message: string, suggestion?: string) {
        super(message, suggestion);
    }
}

class UnknownEventException extends Exception {
    constructor(event: string, suggestion?: string) {
        super(`Unknown event: ${event}`, suggestion);
    }
}

type ChatChannelWrap<E extends keyof DBEventMap> = MessageEvents[E] & { unwrap: DBEventMap[E] };

type ChatChannelWrapOrDefault<E extends keyof EventMap> = E extends keyof DBEventMap ? ChatChannelWrap<E> : EventMap[E];

type OnceWrap<E extends keyof EventMap> = EventMap[E] & { originalListener: ChatChannelWrapOrDefault<E> };

type EventListener<E extends keyof EventMap> = ChatChannelWrapOrDefault<E> | OnceWrap<E>;

function isOnceWrap<E extends keyof EventMap> (listener: EventListener<E>): listener is OnceWrap<E> {
    return 'originalListener' in listener;
}

export class EventEmitter {
    private slot: { [K in keyof EventMap]?: EventListener<K>[] };
    private maxCount: number;

    constructor(
        protected originalBot: Bot,
        protected dbManager: DBManager,
        protected reactClient: ReactClient | undefined,
        protected kakaolinkClient: KakaoShareClient | undefined,
        protected useKakaolink: boolean
    ) {
        this.slot = {};
        this.maxCount = dbManager.getMaxListeners();
    }

    private push<E extends keyof EventMap> (event: E, listener: EventListener<E>) {
        if (!this.slot[event])
            this.slot[event] = [];

        if (this.slot[event].length < this.getMaxListeners())
            this.slot[event].push(listener);
        else
            throw new MaxListenersExceededException(`The number of listeners for event '${event}' exceeds the limit of ${this.getMaxListeners()}`, 'Increase the limit with setMaxListeners()');
    }

    private unshift<E extends keyof EventMap> (event: E, listener: EventListener<E>) {
        if (!this.slot[event])
            this.slot[event] = [];

        if (this.slot[event].length < this.getMaxListeners())
            this.slot[event].unshift(listener);
        else
            throw new MaxListenersExceededException(`The number of listeners for event '${event}' exceeds the limit of ${this.getMaxListeners()}`, 'Increase the limit with setMaxListeners()');
    }

    private _db_listener<E extends keyof DBEventMap> (event: E, listener: DBEventMap[E]): ChatChannelWrap<E> {
        const fn = ((chat: Chat, channel: Channel) => {
            // @ts-ignore
            listener(new Message<Chat>(chat, channel, this.reactClient, this.kakaolinkClient, this.useKakaolink));
        }) as ChatChannelWrap<E>;

        fn.unwrap = listener;
        return fn;
    }

    private _vanilla_event<E extends keyof VanillaEventMap> (event: E): keyof MessengerBotEventMap {
        return event === 'debug' ? 'message' : event as keyof MessengerBotEventMap;
    }
    
    private _on<E extends keyof EventMap> (event: E, listener: EventListener<E>): this {
        if (isDBEvent(event)) {
            // @ts-ignore
            const dbListener = this._db_listener(event, listener);
            // @ts-ignore
            this.dbManager.on(event, dbListener);
            // @ts-ignore
            this.push(event, dbListener);
        }
        else if (isSpecialDBEvent(event)) {
            // @ts-ignore
            this.dbManager.on(event, listener);
            // @ts-ignore
            this.push(event, listener);
        }
        else if (isVanillaEvent(event)) {
            // @ts-ignore
            this.originalBot.on(this._vanilla_event(event), listener);
            // @ts-ignore
            this.push(event, listener);
        }
        else if (isBotEvent(event)) {
            // @ts-ignore
            this.push(event, listener);
        }
        else {
            throw new UnknownEventException(event);
        }

        return this;
    }

    on<E extends keyof EventMap> (event: E, listener: EventMap[E]): this {
        return this._on(event, listener as EventListener<E>);
    }
    
    addListener<E extends keyof EventMap> (event: E, listener: EventMap[E]): this {
        return this.on(event, listener);
    }

    private _prependListener<E extends keyof EventMap> (event: E, listener: EventListener<E>): this {
        if (isDBEvent(event)) {
            // @ts-ignore
            const dbListener = this._db_listener(event, listener);
            // @ts-ignore
            this.dbManager.prependListener(event, dbListener);
            // @ts-ignore
            this.unshift(event, dbListener);
        }
        else if (isSpecialDBEvent(event)) {
            // @ts-ignore
            this.dbManager.prependListener(event, listener);
            // @ts-ignore
            this.unshift(event, listener);
        }
        else if (isVanillaEvent(event)) {
            // @ts-ignore
            this.originalBot.prependListener(this._vanilla_event(event), listener);
            // @ts-ignore
            this.unshift(event, listener);
        }
        else if (isBotEvent(event)) {
            // @ts-ignore
            this.unshift(event, listener);
        }
        else {
            throw new UnknownEventException(event);
        }

        return this;
    }

    prependListener<E extends keyof EventMap> (event: E, listener: EventMap[E]): this {
        return this._prependListener(event, listener as EventListener<E>);
    }

    once<E extends keyof EventMap, F extends ((...args: [...Parameters<EventMap[E]>]) => ReturnType<EventMap[E]>)> (event: E, listener: F): this {
        if (isVanillaEvent(event)) {
            const wrappedListener: OnceWrap<keyof VanillaEventMap> = ((...args: Parameters<F>) => {
                listener(...args);
                // @ts-ignore
                this.off(event, wrappedListener.originalListener);
            }) as OnceWrap<keyof VanillaEventMap>;

            wrappedListener.originalListener = listener as unknown as ChatChannelWrapOrDefault<keyof VanillaEventMap>;
            this._on(event, wrappedListener as EventListener<E>);
        }
        else if (isBotEvent(event)) {
            const wrappedListener: OnceWrap<keyof BotEventMap> = ((...args: Parameters<F>) => {
                listener(...args);
                // @ts-ignore
                this.off(event, wrappedListener.originalListener);
            }) as OnceWrap<keyof BotEventMap>;

            wrappedListener.originalListener = listener as unknown as ChatChannelWrapOrDefault<keyof BotEventMap>;
            this._on(event, wrappedListener as EventListener<E>);
        }
        else if (isSpecialDBEvent(event)) {
            const wrappedListener: OnceWrap<keyof SpecialDBEventMap> = ((...args: Parameters<F>) => {
                listener(...args);
                // @ts-ignore
                this.off(event, wrappedListener.originalListener);
            }) as OnceWrap<keyof SpecialDBEventMap>;

            wrappedListener.originalListener = listener as unknown as ChatChannelWrapOrDefault<keyof SpecialDBEventMap>;
            this._on(event, wrappedListener as EventListener<E>);
        }
        else if (isDBEvent(event)) {
            const wrappedListener: OnceWrap<keyof DBEventMap> = ((...args: Parameters<F>) => {
                listener(...args);
                // @ts-ignore
                this.off(event, wrappedListener.originalListener.unwrap);
            }) as OnceWrap<keyof DBEventMap>;

            wrappedListener.originalListener = listener as unknown as ChatChannelWrapOrDefault<keyof DBEventMap>;
            this._on(event, wrappedListener as EventListener<E>);
        }
        else {
            throw new UnknownEventException(event);
        }

        return this;
    }

    prependOnceListener<E extends keyof EventMap> (event: E, listener: EventMap[E]): this {
        if (isDBEvent(event) || isSpecialDBEvent(event) || isBotEvent(event) || isVanillaEvent(event)) {
            const wrappedListener = ((...args: Parameters<typeof listener>) => {
                // @ts-ignore
                listener(...args);
                this.off(event, wrappedListener);
            }) as OnceWrap<E>;

            wrappedListener.originalListener = listener as ChatChannelWrapOrDefault<E>;
            this._prependListener(event, wrappedListener);
        }
        else {
            throw new UnknownEventException(event);
        }

        return this;
    }

    off<E extends keyof EventMap>(event: E, listener: EventMap[E]): this {
        if (isDBEvent(event)) {
            const idx = this.slot[event]?.findIndex((l: EventListener<keyof DBEventMap>) =>
                isOnceWrap(l) ? l.originalListener.unwrap === listener : l.unwrap === listener
            ) ?? -1;

            if (idx !== -1) {
                const dbListener = this.slot[event]!![idx];
                // @ts-ignore
                this.dbManager.off(event, dbListener);
                this.slot[event]!!.splice(idx, 1);
            }
        }
        else if (isSpecialDBEvent(event)) {
            const idx = this.slot[event]?.findIndex((l: EventListener<keyof SpecialDBEventMap>) =>
                isOnceWrap(l) ? l.originalListener === listener : l === listener
            ) ?? -1;

            if (idx !== -1) {
                const dbListener = this.slot[event]!![idx];
                // @ts-ignore
                this.dbManager.off(event, dbListener);
                this.slot[event]!!.splice(idx, 1);
            }
        }
        else if (isVanillaEvent(event)) {
            const idx = this.slot[event]?.findIndex((l: EventListener<keyof VanillaEventMap>) =>
                isOnceWrap(l) ? l.originalListener === listener : l === listener
            ) ?? -1;
            
            if (idx !== -1) {
                const vanillaListener = this.slot[event]!![idx];
                this.originalBot.off(this._vanilla_event(event), vanillaListener);
                this.slot[event]!!.splice(idx, 1);
            }
        }
        else if (isBotEvent(event)) {
            const idx = this.slot[event]?.findIndex((l: EventListener<keyof BotEventMap>) =>
                isOnceWrap(l) ? l.originalListener === listener : l === listener
            ) ?? -1;

            if (idx !== -1) {
                this.slot[event]!!.splice(idx, 1);
            }
        }
        else {
            throw new UnknownEventException(event);
        }

        return this;
    }

    removeListener<E extends keyof EventMap> (event: E, listener: EventMap[E]): this {
        return this.off(event, listener);
    }

    removeAllListeners<E extends keyof EventMap> (event?: E): this {
        if (event !== undefined) {
            if (isDBEvent(event) || isSpecialDBEvent(event))
                this.dbManager.removeAllListeners(event);
            else if (isVanillaEvent(event))
                this.originalBot.removeAllListeners(this._vanilla_event(event));
            else if (isBotEvent(event)) {}
            else {
                throw new UnknownEventException(event);
            }

            delete this.slot[event];
        }
        else {
            this.dbManager.removeAllListeners();
            this.eventNames().forEach(evt => {
                if (isVanillaEvent(String(evt)))
                    this.originalBot.removeAllListeners(this._vanilla_event(String(evt) as keyof VanillaEventMap));
            });
            this.slot = {};
        }

        return this;
    }

    // TEST: 1. dbmanager emit이 잘 되는지, 2. once인 애들은 emit 하면 사라지는지
    emit<E extends keyof EventMap> (event: E, ...args: Parameters<EventMap[E]>): boolean {
        if (!this.slot[event])
            return false;
        else if (isVanillaEvent(event)) {
            // @ts-ignore
            this.slot[event].forEach(listener => listener(...args));
            return true;
        }
        else if (isBotEvent(event)) {
            // @ts-ignore
            this.slot[event].forEach(listener => listener(...args));
            return true;
        }
        else if (isSpecialDBEvent(event)) {
            // @ts-ignore
            return this.dbManager.emit(event, ...args);
        }
        else if (isDBEvent(event)) {
            const msg = args[0];
            // @ts-ignore
            return this.dbManager.emit(event, msg.chat, msg.channel);
        }
        else {
            throw new UnknownEventException(event);
        }
    }

    eventNames(): (keyof EventMap | string | symbol)[] {
        return [...Object.keys(this.slot), ...Object.getOwnPropertySymbols(this.slot)];
    }

    rawListeners<E extends keyof EventMap> (event: E): EventMap[E][] {
        return this.listeners(event).map(l => {
            // (l.unwrap ?? l).originalListener ?? (l.unwrap ?? l)

            if (isOnceWrap(l)) {
                // @ts-ignore
                return isDBEvent(event) ? l.originalListener.unwrap : l.originalListener;
            }
            else {
                // @ts-ignore
                return isDBEvent(event) ? l.unwrap : l;
            }
        });
    }

    listeners<E extends keyof EventMap> (event: E): EventListener<E>[] {
        return this.slot[event] ?? [];
    }

    listenerCount<E extends keyof EventMap> (event: E): number {
        return this.slot[event]?.length ?? 0;
    }

    getMaxListeners(): number {
        return this.maxCount;
    }

    setMaxListeners(maxListeners: number): this {
        this.maxCount = maxListeners;
        return this;
    }
}