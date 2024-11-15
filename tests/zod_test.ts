import { z } from 'zod';

const a = z.string();
const b = z.string().emoji()

const trimmedLength = z
    .function()
    .args(z.string(), z.number())
    .returns(z.void())
    .implement((x, y) => {
        return x.length + y;    // void 타입은 컴파일러 단계에서 체크 안 됨
        console.log(x, y);
    });

let str = z.number();
str

// trimmedLength('3', 5);

const addFn = z.function().args(z.number(), z.number()).returns(z.number());
console.log(addFn.parse((a: number, b: number) => a + b));
console.log(addFn.parse((a: string) => a));

/////////////////////////////////////////////

// type Validator<T> = (arg: any) => arg is T;
//
// class ZodFunction<InputTypes extends any[] = [], OutputType = unknown> {
//     private inputValidators: Validator<any>[] = [];
//     private outputValidator?: Validator<OutputType>;
//
//     // 여러 입력값 타입을 지원하는 args() 메서드
//     args<Args extends any[]>(...validators: { [K in keyof Args]: Validator<Args[K]> }) {
//         const newFunction = new ZodFunction<Args, OutputType>();
//         newFunction.inputValidators = validators;
//         return newFunction;
//     }
//
//     returns<T>(validator: Validator<T>) {
//         const newFunction = new ZodFunction<InputTypes, T>();
//         newFunction.inputValidators = this.inputValidators;
//         newFunction.outputValidator = validator;
//         return newFunction;
//     }
//
//     implement(fn: (firstArg: bigint, ...args: InputTypes) => OutputType) {
//         return (firstArg: bigint, ...args: any[]) => {
//             // 입력값 검증
//             for (let i = 0; i < this.inputValidators.length; i++) {
//                 if (!this.inputValidators[i](args[i])) {
//                     throw new Error(`Argument at position ${i} is invalid`);
//                 }
//             }
//
//             // 함수 실행
//             const result = fn(firstArg, ...(args as InputTypes));
//
//             // 출력값 검증
//             if (this.outputValidator && !this.outputValidator(result)) {
//                 throw new Error(`Return value is invalid`);
//             }
//
//             return result;
//         };
//     }
// }
//
// // 타입 가드 (타입 검증용)
// const z = {
//     string: (): Validator<string> => {
//         return (arg: any): arg is string => typeof arg === 'string';
//     },
//     number: (): Validator<number> => {
//         return (arg: any): arg is number => typeof arg === 'number';
//     },
//     function: () => {
//         return new ZodFunction();
//     }
// };
//
// // 사용 예시
// const trimmedLength = z
//     .function()
//     .args(z.string(), z.number(), z.string())   // 입력값으로 문자열과 숫자를 모두 허용
//     .returns(z.string()) // 출력값은 숫자여야 함
//     .implement((b, x, y, z) => {
//         // x는 자동으로 string, y는 자동으로 number로 추론됨
//         return String(x.trim().length + y);
//     });
//
// console.log(trimmedLength(" sandwich ", 5)); // => 13
// console.log(trimmedLength("  asdf ", 2));  // => 8
// // console.log(trimmedLength(123, 5));      // 오류 발생 (입력값이 문자열이 아님)
