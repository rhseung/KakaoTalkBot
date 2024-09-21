import { Chat } from "../api/db-manager/classes";

type FallbackCallback<T> = (chat: Chat) => T;

export abstract class Type<T> {
    private fallbackObj: { message?: string, callback?: FallbackCallback<T> }

    constructor() {
        this.fallbackObj = {};
    }

    abstract isValid(value: T): boolean;

    abstract parse(value: string): T;

    fallback(message: string, callback: FallbackCallback<T> = chat => this.parse(chat.text.trim())) {
        this.fallbackObj.message = message;
        this.fallbackObj.callback = callback;

        return this;
    }
}

export class ValidationError extends TypeError {
    constructor(value: any, expected: string) {
        super(`${value} unexpected type. Expected ${expected}`);
        this.name = 'ValidationError';
    }
}

export class IntType extends Type<number> {
    override isValid(value: number): boolean {
        return Number.isInteger(value);
    }

    override parse(value: string): number {
        const val = parseFloat(value);

        if (!this.isValid(val))
            throw new ValidationError(value, 'integer');

        return val;
    }
}

export class FloatType extends Type<number> {
    override isValid(value: number): boolean {
        return typeof value === 'number';
    }

    override parse(value: string): number {
        const val = parseFloat(value);

        if (!this.isValid(val))
            throw new ValidationError(value, 'float');

        return val;
    }
}

export class StrType extends Type<string> {
    override isValid(value: string): boolean {
        return typeof value === 'string';
    }

    override parse(value: string): string {
        if (!this.isValid(value))
            throw new ValidationError(value, 'string');

        return value;
    }
}

export class OptionalType<T> extends Type<T | undefined> {
    constructor(private type: Type<T>, private defaultValue?: T) {
        super();

        if (defaultValue !== undefined && !type.isValid(defaultValue))
            throw new ValidationError(defaultValue, type.constructor.name);
    }

    override isValid(value: T | undefined): boolean {
        if (value !== undefined)
            return this.type.isValid(value);
        
        return true;
    }

    override parse(value: string | undefined): T | undefined {
        if (value === undefined)
            return this.defaultValue;
        if (!this.isValid(value))
            throw new ValidationError(value, this.type.constructor.name);

        return this.type.parse(value);
    }
}

export class UnionType extends Type<any> {
    private types: Type<any>[];

    constructor(...types: Type<any>[]) {
        super();
        this.types = types;
    }

    override isValid(value) {
        return this.types.some(type => type.isValid(value));
    }

    override parse(value) {
        const type = this.types.find(type => type.isValid(value));
        if (type === undefined)
            throw new ValidationError(value, this.types.map(type => type.constructor.name).join(', '));

        return type.parse(value);
    }
}

export class ChoiceType extends Type<any> {
    private choices: Type<any>[];

    constructor(...choices: Type<any>[]) {
        super();
        this.choices = choices;
    }

    override isValid(value) {
        return this.choices.includes(value);
    }

    override parse(value) {
        if (!this.isValid(value))
            throw new ValidationError(value, this.choices.join(', '));

        return value;
    }
}

export class AnnotatedType<T> extends Type<T> {
    constructor(private type: Type<T>, private condition: (value: T) => boolean) {
        super();
    }

    override isValid(value: T): boolean {
        return this.type.isValid(value) && this.condition(value);
    }

    override parse(value: any): T {
        if (!this.isValid(value))
            throw new ValidationError(value, this.type.constructor.name);

        return this.type.parse(value);
    }
}

export class RestType<T> extends Type<T[]> {
    constructor(private type: Type<T>) {
        super();
    }

    override isValid(value: T[]): boolean {
        return value.every(v => this.type.isValid(v));
    }

    override parse(value: any): T[] {
        if (!Array.isArray(value))
            throw new ValidationError(value, 'array');
        if (!this.isValid(value))
            throw new ValidationError(value, this.type.constructor.name);

        return value.map(v => this.type.parse(v));
    }
}

export const Int = new IntType();
export const Float = new FloatType();
export const Str = new StrType();

export const Optional = (type, defaultValue=undefined) => new OptionalType(type, defaultValue);
export const Union = (...types) => new UnionType(...types);
export const Choice = (...choices) => new ChoiceType(...choices);
export const Annotated = (type, condition) => new AnnotatedType(type, condition);
export const Rest = type => new RestType(type);
