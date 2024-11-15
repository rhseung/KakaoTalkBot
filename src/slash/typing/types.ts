abstract class Type<T = any> {
    protected checkList: ((value: T) => boolean)[] = [];

    protected constructor() {}
    abstract copy(): Type<T>;
    test(value: any): value is T {
        return this.checkList.every(checker => checker(value));
    }
}

class StringType extends Type<string> {
    maxLength?: number;
    minLength?: number;
    pattern?: RegExp;

    constructor() {
        super();
    }

    copy(): StringType {
        const instance = new StringType();
        instance.maxLength = this.maxLength;
        instance.minLength = this.minLength;
        instance.pattern = this.pattern;
        instance.checkList = this.checkList;
        return instance;
    }
    
    override test(value: any): value is string {
        return super.test(value) && typeof value === 'string';
    }

    max(length: number) {
        const instance = this.copy();
        instance.maxLength = length;
        instance.checkList.push(v => v.length <= length);
        return instance;
    }

    min(length: number) {
        const instance = this.copy();
        instance.minLength = length;
        instance.checkList.push(v => v.length >= length);
        return instance;
    }

    length(length: number) {
        return this.min(length).max(length);
    }

    regex(pattern: RegExp) {
        const instance = this.copy();
        instance.pattern = pattern;
        instance.checkList.push(v => pattern.test(v));
        return instance;
    }

    includes(searchString: string, position: number = 0): StringType {
        const instance = this.copy();
        instance.checkList.push(v => v.includes(searchString, position));
        return instance;
    }

    startsWith(searchString: string, position: number = 0): StringType {
        const instance = this.copy();
        instance.checkList.push(v => v.startsWith(searchString, position));
        return instance;
    }

    endsWith(searchString: string, position: number = 0): StringType {
        const instance = this.copy();
        instance.checkList.push(v => v.endsWith(searchString, position));
        return instance;
    }
}

class NumberType extends Type<number> {
    maxValue?: number;
    minValue?: number;
    isInteger?: boolean;
    isFinite?: boolean;

    constructor() {
        super();
    }

    copy() {
        const instance = new NumberType();
        instance.maxValue = this.maxValue;
        instance.minValue = this.minValue;
        instance.isInteger = this.isInteger;
        instance.isFinite = this.isFinite;
        instance.checkList = this.checkList;
        return instance;
    }
    
    override test(value: any): value is number {
        return super.test(value) && typeof value === 'number';
    }

    ge(value: number) {
        const instance = this.copy();
        instance.maxValue = value;
        instance.checkList.push(v => v >= value);
        return instance;
    }

    gt(value: number) {
        const instance = this.copy();
        instance.minValue = value;
        instance.checkList.push(v => v > value);
        return instance
    }

    le(value: number) {
        const instance = this.copy();
        instance.maxValue = value;
        instance.checkList.push(v => v <= value);
        return instance;
    }

    lt(value: number) {
        const instance = this.copy();
        instance.minValue = value;
        instance.checkList.push(v => v < value);
        return instance;
    }

    max(value: number) {
        return this.le(value);
    }

    min(value: number) {
        return this.ge(value);
    }

    positive() {
        return this.gt(0);
    }

    negative() {
        return this.lt(0);
    }

    nonPositive() {
        return this.le(0);
    }

    nonNegative() {
        return this.ge(0);
    }

    multipleOf(base: number) {
        const instance = this.copy();
        instance.checkList.push(v => v % base === 0);
        return instance;
    }

    int() {
        const instance = this.copy();
        instance.isInteger = true;
        instance.checkList.push(Number.isInteger);
        return instance;
    }

    finite() {
        const instance = this.copy();
        instance.isFinite = true;
        instance.checkList.push(Number.isFinite);
        return instance;
    }
}

class BigIntType extends Type<bigint> {
    maxValue?: bigint;
    minValue?: bigint;
    isFinite?: boolean;

    constructor() {
        super();
    }

    copy() {
        const instance = new BigIntType();
        instance.maxValue = this.maxValue;
        instance.minValue = this.minValue;
        instance.isFinite = this.isFinite;
        instance.checkList = this.checkList;
        return instance;
    }

    override test(value: any): value is bigint {
        return super.test(value) && typeof value === 'bigint';
    }

    ge(value: bigint) {
        const instance = this.copy();
        instance.maxValue = value;
        instance.checkList.push(v => v >= value);
        return instance;
    }

    gt(value: bigint) {
        const instance = this.copy();
        instance.minValue = value;
        instance.checkList.push(v => v > value);
        return instance
    }

    le(value: bigint) {
        const instance = this.copy();
        instance.maxValue = value;
        instance.checkList.push(v => v <= value);
        return instance;
    }

    lt(value: bigint) {
        const instance = this.copy();
        instance.minValue = value;
        instance.checkList.push(v => v < value);
        return instance;
    }

    max(value: bigint) {
        return this.le(value);
    }

    min(value: bigint) {
        return this.ge(value);
    }

    positive() {
        return this.gt(0n);
    }

    negative() {
        return this.lt(0n);
    }

    nonPositive() {
        return this.le(0n);
    }

    nonNegative() {
        return this.ge(0n);
    }

    multipleOf(base: bigint) {
        const instance = this.copy();
        instance.checkList.push(v => v % base === 0n);
        return instance;
    }
}

class BooleanType extends Type<boolean> {
    constructor() {
        super();
    }

    copy(): BooleanType {
        const instance = new BooleanType();
        instance.checkList = this.checkList;
        return instance;
    }

    override test(value: any): value is boolean {
        return super.test(value) && typeof value === 'boolean';
    }
}

class SymbolType extends Type<symbol> {
    constructor() {
        super();
    }

    copy(): SymbolType {
        const instance = new SymbolType();
        instance.checkList = this.checkList;
        return instance;
    }

    override test(value: any): value is symbol {
        return super.test(value) && typeof value === 'symbol';
    }
}

class NullType extends Type<null> {
    constructor() {
        super();
    }

    copy(): NullType {
        const instance = new NullType();
        instance.checkList = this.checkList;
        return instance;
    }

    override test(value: any): value is null {
        return super.test(value) && value === null;
    }
}

class UndefinedType extends Type<undefined> {
    constructor() {
        super();
    }

    copy(): UndefinedType {
        const instance = new UndefinedType();
        instance.checkList = this.checkList;
        return instance;
    }

    override test(value: any): value is undefined {
        return super.test(value) && value === undefined;
    }
}

class VoidType extends Type<void> {
    constructor() {
        super();
    }

    copy(): VoidType {
        const instance = new VoidType();
        instance.checkList = this.checkList;
        return instance;
    }

    override test(value: any): value is void {
        return super.test(value) && value === undefined;
    }
}

class AnyType extends Type<any> {
    constructor() {
        super();
    }

    copy(): AnyType {
        const instance = new AnyType();
        instance.checkList = this.checkList;
        return instance;
    }

    override test(value: any): value is any {
        return super.test(value) && true;
    }
}

class UnknownType extends Type<unknown> {
    constructor() {
        super();
    }

    copy(): UnknownType {
        const instance = new UnknownType();
        instance.checkList = this.checkList;
        return instance;
    }

    override test(value: any): value is unknown {
        return super.test(value) && true;
    }
}

class NeverType extends Type<never> {
    constructor() {
        super();
    }

    copy(): NeverType {
        const instance = new NeverType();
        instance.checkList = this.checkList;
        return instance;
    }

    override test(value: any): value is never {
        return super.test(value) && false;
    }
}

class FunctionType<Inputs extends unknown[] = [], Output = void> extends Type<(...args: Inputs) => Output> {
    accessor parameterTypes: { [K in keyof Inputs]: Type<Inputs[K]> } = [] as any;
    accessor returnType: Type<Output> = new VoidType() as any;
    accessor executor: (...args: Inputs) => Output = (() => {}) as any;

    constructor() {
        super();
    }

    copy<I extends unknown[], O>() {
        const instance = new FunctionType<I, O>();
        instance.parameterTypes = this.parameterTypes as any;
        instance.returnType = this.returnType as any;
        instance.executor = this.executor as any;
        return instance;
    }

    override test(value: any): value is (...args: Inputs) => Output {
        return super.test(value) && typeof value === 'function';
    }

    args<Args extends unknown[]> (...args: { [K in keyof Args]: Type<Args[K]> }) {
        const instance = this.copy<Args, Output>();
        instance.parameterTypes = args;
        return instance;
    }

    returns<Return> (type: Type<Return>) {
        const instance = this.copy<Inputs, Return>();
        instance.returnType = type;
        return instance;
    }

    implement(fn: (...args: Inputs) => Output) {
        const instance = this.copy<Inputs, Output>();
        instance.executor = (...args: Parameters<typeof fn>): ReturnType<typeof fn> => {
            this.parameterTypes.forEach((input, idx) => input.test(args[idx]));
            const result = fn(...args);
            this.returnType?.test(result);
            return result;
        };
        return instance;
    }

    execute(...args: Inputs) {
        return this.executor(...args);
    }
}

// const stringType = (...args: ConstructorParameters<typeof StringType>) => new StringType(...args);
const stringType = new StringType();
// const numberType = (...args: ConstructorParameters<typeof NumberType>) => new NumberType(...args);
const numberType = new NumberType();
// const bigIntType = (...args: ConstructorParameters<typeof BigIntType>) => new BigIntType(...args);
const bigIntType = new BigIntType();
// const booleanType = (...args: ConstructorParameters<typeof BooleanType>) => new BooleanType(...args);
const booleanType = new BooleanType();
// const symbolType = (...args: ConstructorParameters<typeof SymbolType>) => new SymbolType(...args);
const symbolType = new SymbolType();
// const nullType = (...args: ConstructorParameters<typeof NullType>) => new NullType(...args);
const nullType = new NullType();
// const undefinedType = (...args: ConstructorParameters<typeof UndefinedType>) => new UndefinedType(...args);
const undefinedType = new UndefinedType();
// const voidType = (...args: ConstructorParameters<typeof VoidType>) => new VoidType(...args);
const voidType = new VoidType();
// const anyType = (...args: ConstructorParameters<typeof AnyType>) => new AnyType(...args);
const anyType = new AnyType();
// const unknownType = (...args: ConstructorParameters<typeof UnknownType>) => new UnknownType(...args);
const unknownType = new UnknownType();
// const neverType = (...args: ConstructorParameters<typeof NeverType>) => new NeverType(...args);
const neverType = new NeverType();
// const functionType = <I extends unknown[] = [], O = void>(...args: ConstructorParameters<typeof FunctionType>) => new FunctionType<I, O>(...args);
const functionType = new FunctionType();

type typeOf<T> = T extends Type<infer U> ? U : never;

export {
    Type,
    typeOf,

    StringType,
    stringType as string,
    NumberType,
    numberType as number,
    BigIntType,
    bigIntType as bigint,
    BooleanType,
    booleanType as boolean,
    SymbolType,
    symbolType as symbol,
    NullType,
    nullType as null,
    UndefinedType,
    undefinedType as undefined,
    VoidType,
    voidType as void,
    AnyType,
    anyType as any,
    UnknownType,
    unknownType as unknown,
    NeverType,
    neverType as never,
    FunctionType,
    functionType as function,
}
