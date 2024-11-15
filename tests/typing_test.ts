import * as T from '../src/slash/typing';

const hello_world = T.function.implement(() => console.log('Hello, world!'));
hello_world.execute();

const trimmedLength = T.function
    .args(T.string, T.number, T.string)
    .returns(T.number)
    .implement((a, b, c) => {
        return a.trim().length + b + c.trim().length;
    });
console.log(trimmedLength.execute('  hello  ', 3, '  world  ')); // 13

const sample_number = T.number.int().min(3).max(5);
console.log(sample_number.test(2)); // true
console.log(sample_number.test(3)); // true
console.log(sample_number.test(4)); // true
console.log(sample_number.test(4.5)); // true
console.log(sample_number.test(5)); // true
console.log(sample_number.test(6)); // true

function inferSchema<T>(schema: T.Type<T>) {
    return schema;
}
const r = inferSchema(sample_number);

function inferSchema2<T extends T.Type>(schema: T) {
    return schema;
}
const r2 = inferSchema2(sample_number);