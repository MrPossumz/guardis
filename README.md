# Guardis

> _Do you miss being able to just declare types while scaffolding out your
> code?_

> _Frustrated trying to manually code out property validation on objects to
> appease the ts linter?_

> _Tired of getting locked into a validation library that requires you to use
> their schema to define your program types?_

Maximize the benefits of the TS linter to validate your types without limiting
yourself to a third party schema for type definitions.

### Summary

Guardis is an unopinionated validation and type guard system that prioritizes
using TypeScript types to define your validation logic, and not the other way
around.

Use the included type guards to perform validation or quickly generate your own
anywhere in your code, using your existing type definitions.

## Features

- Modular library of common used types
- No 3rd party dependencies
- No library lock in
- Extensible
- Base your validations on your types, not the other way around
- Make the most of TypeScript by letting it double check your validations

# Usage

Guardis comes with two primary tools. The first is a library of commonly used
type guards which you can simply import and apply in your code.

### Standard Type Guards

The standard guards can be imported directly from the package. These are type
checks for commonly used types, such as primitives. For a full list of available
guards, see the documentation.

```ts
import { isString } from "jsr:@mr-possumz/guardis";

let a: unknown = "someValue";

if (isString(a)) {
  // TypeScript now knows that any code in this block should
  // treat the variable "a" as a string type.
}
```

To avoid generating large import lists in files that require multiple type
guards, the package exports the `Is` object which can also be used to call any
standard guard.

```ts
import { Is } from "jsr:@mr-possumz/guardis";

Is.Array(["a", "b", "c"]);
```

### Strict Mode

Each type guard includes a "strict" mode. When invoked, if the type guard fails
then an error is thrown. Custom messages can be specified when invoking the
method.

```ts
let str: unknown = "a";
let num: unknown = 1;

isNumber.strict(num);
num += 1; // TS knows that "num" is a number

isNumber.strict(str);
str += 1; // Ts knows that if this point of the code is reached then
// "str" must be a number, or else an error would have been
// thrown.
```

## Creating New Type Guards

Custom guards can be created using the `createTypeGuard` function. This expects
a callback that returns your expected type, or null if validation fails.

> **Note:** that if your validation fails then the function **must** return null
> to indicate that. Throwing an error or returning any other value will cause
> unintended behavior.

```ts
import { createTypeGuard } from "guardis";

type ZeroOrOne = 0 | 1;

const isZeroOrOne = createTypeGuard((t) => {
  return t === 0 || t === 1 ? t : null;
});

isZeroOrOne(1); // true
izZeroOrOne(0); //true
isZeroOrOne("a"); // false
```

#### Typing Complex Objects

When typing objects with many properties it can become unwieldy to manually test
each property. Similarly, it can be an exercise in frustration to get the TS
server to coerce these checks into satisfying your desired type. To simplify
this, the `createTypeGuard` passes the `has` utility to each callback.

This can be used to check for the presence of a key. It also accepts an optional
third argument to verify the value.

```ts
type User = {
  id: number;
  name: string;
  email: string;
};

const isUser = createTypeGuard((t, has) => {
  if (
    isObject(t) &&
    has(t, "id", isNumber) &&
    has(t, "name", isString) &&
    has(t, "email", isString)
  ) {
    return t;
  }

  return null;
});
```

## Modules

Beyond the default included types, Guardis offers modules tailored towards more
specific use cases. Currently this includes the **_http_** module but the
catalog will expand as more updates are added.

## Batch Generating Type Guards

Hate having to call `createTypeGuard` repeatedly for every type you want to define? So do we! That's why we created the `batch` method to just generate a whole bunch of them in a single call.

```ts
const { isMeatball, isSausage, isSpaghetti } = batch({
	Meatball: (v) => v === "meatball" ? v : null,
	Sausage: (v) => v === "sausage" ? v : null,
	Spaghetti: (v) => v === "spaghetti" ? v : null,
});
```
The batch method will automatically generate typed guards for each key-value in your input object. Too lazy to have to capitalize every key? That's fine too! The batch method will accept any casing and convert it to the camel case format of `isKey`.

## Extending

Want to extend the `Is` object for your own purposes? Guardis includes an easy
way to bundle in your own custom types and keep them under one simple interface.
You can use the `extend` method to generate a new `Is` object or modify an
existing one.

```ts
// Generating a new Is object
const Is = extend({ Meatball: (v: unknown) => v === "meatball" ? v : null });

Is.Meatball(true); // false
Is.Meatball(1); //false
Is.Meatball("meatball"); // True

// Extending an existing Is object
import { Is as _Is } from "jsr:@mr-possumz/guardis";

const Is = extend(_Is, {
  Sausage: (v: unknown) => v === "sausage" ? v : null,
});
```
