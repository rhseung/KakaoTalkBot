import { Chat, User } from "../../../kakao_modules/db-manager/classes";
import { Exception, TypeException } from "../../utils";

type FallbackCallback<T> = (chat: Chat) => T | null;

export abstract class Type<T> {
    private fallbackObj: { message?: string, callback?: FallbackCallback<T> } = {};

    constructor() {};

    abstract parse(value: this extends OptionalType<T> ? (this extends MentionType ? User : string) | undefined : (this extends MentionType ? User : string)): T | null;

    isValid(value: this extends MentionType ? User : string): boolean {
        return this.parse(value) !== null;
    }

    fallback(
        message: string,
        callback: FallbackCallback<T> = chat => this.parse(chat.text.trim())
    ) {
        this.fallbackObj.message = message;
        this.fallbackObj.callback = callback;

        return this;
    }
}

export class ValidationException extends TypeException {
    constructor(value: any, type: string, suggestion?: string) {
        super(value, type, suggestion);
    }
}

export class IntType extends Type<number> {
    override parse(value: this extends OptionalType<number> ? string | undefined : string): number | null {
        const val = parseFloat(value);

        if (isNaN(val))
            return null;
        else if (!Number.isInteger(val))
            return null;

        return val;
    }
}

export class FloatType extends Type<number> {
    override parse(value: this extends OptionalType<number> ? string | undefined : string): number | null {
        const val = parseFloat(value);

        if (isNaN(val))
            return null;

        return val;
    }
}

export class StrType extends Type<string> {
    override parse(value: this extends OptionalType<string> ? string | undefined : string): string | null {
        // NOTE: 숫자적 문자열도 그냥 문자열로 할까?
        if (!/^\D.*$/.test(value))
            return null;

        return value;
    }
}

export class MentionType extends Type<User> {
    override parse(value: this extends OptionalType<User> ? User | undefined : User): User | null {
        if (!(value instanceof User))
            return null;

        return value;
    }
}

export class OptionalType<T> extends Type<T | undefined> {
    constructor(private type: Type<T>, private defaultValue?: T) {
        super();
    }

    // TODO: optional이니까 value에 undefined가 들어올 수도 있음
    parse(value: this extends OptionalType<T | undefined> ? string | undefined : string): T | null {
        if (value === undefined)
            return this.defaultValue ?? null;

        if (!this.type.isValid(value))
            return null;

        return this.type.parse(value);
    }
}

export class UnionType extends Type<any> {
    private types: Type<any>[];

    constructor(...types: Type<any>[]) {
        super();
        this.types = types;
    }

    override parse(value: this extends OptionalType<any> ? string | undefined : string): any | null {
        const type = this.types.find(type => type.isValid(value));
        
        if (type === undefined)
            return null;

        return type.parse(value);
    }
}

export class ChoiceType extends Type<string> {
    private choices: string[];

    constructor(...choices: string[]) {
        super();
        this.choices = choices;
    }

    override parse(value: this extends OptionalType<string> ? string | undefined : string): string | null {
        if (!this.choices.includes(value))
            return null;

        return value;
    }
}

export class AnnotatedType<T> extends Type<T> {
    constructor(private type: Type<T>, private condition: (value: T) => boolean) {
        super();
    }

    override parse(value: this extends OptionalType<T> ? string | undefined : string): T | null {
        const val = this.type.parse(value);
        
        if (val === null)
            return null;
        else if (!this.condition(val))
            return null;

        return val;
    }
}

export class RestType<T> extends Type<T[]> {
    constructor(private type: Type<T>) {
        super();
    }

    // TODO: value에 여러 개가 들어오게 해야함.
    override parse(value: this extends OptionalType<T[]> ? string | undefined : string): T[] | null {
        if (!Array.isArray(value))
            throw new ValidationException(value, 'array');
        if (!this.isValid(value))
            throw new ValidationException(value, this.type.constructor.name);

        return value.map(v => this.type.parse(v));
    }
}

export const Int = new IntType();
export const Float = new FloatType();
export const Str = new StrType();
export const Mention = new MentionType();

export const Optional = (type, defaultValue=undefined) => new OptionalType(type, defaultValue);
export const Union = (...types) => new UnionType(...types);
export const Choice = (...choices) => new ChoiceType(...choices);
export const Annotated = (type, condition) => new AnnotatedType(type, condition);
export const Rest = type => new RestType(type);
