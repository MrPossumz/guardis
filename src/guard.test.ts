import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import {
  createTypeGuard,
  hasOptionalProperty,
  hasProperty,
  includes,
  isArray,
  isBinary,
  isBoolean,
  isDate,
  isEmpty,
  isFunction,
  isIterable,
  isJsonArray,
  isJsonObject,
  isJsonPrimitive,
  isJsonValue,
  isNil,
  isNull,
  isNumber,
  isNumeric,
  isObject,
  isString,
  isTuple,
  isUndefined,
  tupleHas,
} from "./guard.ts";

// Standard test values for consistency across all type guard tests
const TEST_VALUES = {
  // Primitive values
  string: "test",
  emptyString: "",
  number: 42,
  zero: 0,
  float: 3.14,
  infinity: Infinity,
  negativeInfinity: -Infinity,
  boolean: true,
  booleanFalse: false,
  nullValue: null,
  undefinedValue: undefined,

  // Complex values
  emptyObject: {},
  object: { a: 1, b: "test" },
  emptyArray: [],
  array: [1, 2, 3],
  function: () => {},
  date: new Date(),

  // Special values
  binaryZero: 0 as const,
  binaryOne: 1 as const,
  numericString: "123",
  invalidNumericString: "abc",
  iterator: [1, 2, 3][Symbol.iterator](),
} as const;

// === Core Type Guards ===

Deno.test("isBoolean", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isBoolean(TEST_VALUES.boolean));
    assert(isBoolean(TEST_VALUES.booleanFalse));

    // Invalid inputs
    assertFalse(isBoolean(TEST_VALUES.string));
    assertFalse(isBoolean(TEST_VALUES.number));
    assertFalse(isBoolean(TEST_VALUES.zero));
    assertFalse(isBoolean(TEST_VALUES.nullValue));
    assertFalse(isBoolean(TEST_VALUES.undefinedValue));
    assertFalse(isBoolean(TEST_VALUES.object));
    assertFalse(isBoolean(TEST_VALUES.array));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isBoolean.strict(TEST_VALUES.boolean);
    isBoolean.strict(TEST_VALUES.booleanFalse);

    // Invalid inputs throw
    assertThrows(() => isBoolean.strict(TEST_VALUES.string));
    assertThrows(() => isBoolean.strict(TEST_VALUES.number));
    assertThrows(() => isBoolean.strict(TEST_VALUES.nullValue));
    assertThrows(() => isBoolean.strict(TEST_VALUES.undefinedValue));
  });

  await t.step("assert mode", () => {
    const assertIsBoolean: typeof isBoolean.assert = isBoolean.assert;

    // Valid inputs don't throw
    assertIsBoolean(TEST_VALUES.boolean);
    assertIsBoolean(TEST_VALUES.booleanFalse);

    // Invalid inputs throw
    assertThrows(() => assertIsBoolean(TEST_VALUES.string));
    assertThrows(() => assertIsBoolean(TEST_VALUES.number));
    assertThrows(() => assertIsBoolean(TEST_VALUES.nullValue));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isBoolean.optional(TEST_VALUES.boolean));
    assert(isBoolean.optional(TEST_VALUES.booleanFalse));
    assert(isBoolean.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isBoolean.optional(TEST_VALUES.string));
    assertFalse(isBoolean.optional(TEST_VALUES.nullValue));
    assertFalse(isBoolean.optional(TEST_VALUES.number));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs (booleans are never considered empty)
    assert(isBoolean.notEmpty(TEST_VALUES.boolean));
    assert(isBoolean.notEmpty(TEST_VALUES.booleanFalse));

    // Invalid inputs
    assertFalse(isBoolean.notEmpty(TEST_VALUES.string));
    assertFalse(isBoolean.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isBoolean.notEmpty(TEST_VALUES.undefinedValue));
  });
});

Deno.test("isString", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isString(TEST_VALUES.string));
    assert(isString(TEST_VALUES.emptyString));

    // Invalid inputs
    assertFalse(isString(TEST_VALUES.number));
    assertFalse(isString(TEST_VALUES.boolean));
    assertFalse(isString(TEST_VALUES.nullValue));
    assertFalse(isString(TEST_VALUES.undefinedValue));
    assertFalse(isString(TEST_VALUES.object));
    assertFalse(isString(TEST_VALUES.array));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isString.strict(TEST_VALUES.string);
    isString.strict(TEST_VALUES.emptyString);

    // Invalid inputs throw
    assertThrows(() => isString.strict(TEST_VALUES.number));
    assertThrows(() => isString.strict(TEST_VALUES.boolean));
    assertThrows(() => isString.strict(TEST_VALUES.nullValue));
  });

  await t.step("assert mode", () => {
    const assertIsString: typeof isString.assert = isString.assert;

    // Valid inputs don't throw
    assertIsString(TEST_VALUES.string);
    assertIsString(TEST_VALUES.emptyString);

    // Invalid inputs throw
    assertThrows(() => assertIsString(TEST_VALUES.number));
    assertThrows(() => assertIsString(TEST_VALUES.boolean));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isString.optional(TEST_VALUES.string));
    assert(isString.optional(TEST_VALUES.emptyString));
    assert(isString.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isString.optional(TEST_VALUES.number));
    assertFalse(isString.optional(TEST_VALUES.nullValue));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs
    assert(isString.notEmpty(TEST_VALUES.string));

    // Invalid inputs (empty string is considered empty)
    assertFalse(isString.notEmpty(TEST_VALUES.emptyString));
    assertFalse(isString.notEmpty(TEST_VALUES.number));
    assertFalse(isString.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isString.notEmpty(TEST_VALUES.undefinedValue));
  });
});

Deno.test("isNumber", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isNumber(TEST_VALUES.number));
    assert(isNumber(TEST_VALUES.zero));
    assert(isNumber(TEST_VALUES.float));
    assert(isNumber(TEST_VALUES.infinity));
    assert(isNumber(TEST_VALUES.negativeInfinity));

    // Invalid inputs
    assertFalse(isNumber(TEST_VALUES.string));
    assertFalse(isNumber(TEST_VALUES.numericString));
    assertFalse(isNumber(TEST_VALUES.boolean));
    assertFalse(isNumber(TEST_VALUES.nullValue));
    assertFalse(isNumber(TEST_VALUES.undefinedValue));
    assertFalse(isNumber(TEST_VALUES.object));
    assertFalse(isNumber(TEST_VALUES.array));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isNumber.strict(TEST_VALUES.number);
    isNumber.strict(TEST_VALUES.zero);
    isNumber.strict(TEST_VALUES.float);

    // Invalid inputs throw
    assertThrows(() => isNumber.strict(TEST_VALUES.string));
    assertThrows(() => isNumber.strict(TEST_VALUES.numericString));
    assertThrows(() => isNumber.strict(TEST_VALUES.boolean));
  });

  await t.step("assert mode", () => {
    const assertIsNumber: typeof isNumber.assert = isNumber.assert;

    // Valid inputs don't throw
    assertIsNumber(TEST_VALUES.number);
    assertIsNumber(TEST_VALUES.zero);
    assertIsNumber(TEST_VALUES.float);

    // Invalid inputs throw
    assertThrows(() => assertIsNumber(TEST_VALUES.string));
    assertThrows(() => assertIsNumber(TEST_VALUES.numericString));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isNumber.optional(TEST_VALUES.number));
    assert(isNumber.optional(TEST_VALUES.zero));
    assert(isNumber.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isNumber.optional(TEST_VALUES.string));
    assertFalse(isNumber.optional(TEST_VALUES.nullValue));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs (numbers are never considered empty, including 0)
    assert(isNumber.notEmpty(TEST_VALUES.number));
    assert(isNumber.notEmpty(TEST_VALUES.zero));
    assert(isNumber.notEmpty(TEST_VALUES.float));

    // Invalid inputs
    assertFalse(isNumber.notEmpty(TEST_VALUES.string));
    assertFalse(isNumber.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isNumber.notEmpty(TEST_VALUES.undefinedValue));
  });
});

Deno.test("isBinary", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isBinary(TEST_VALUES.binaryZero));
    assert(isBinary(TEST_VALUES.binaryOne));

    // Invalid inputs
    assertFalse(isBinary(TEST_VALUES.number)); // 42
    assertFalse(isBinary(TEST_VALUES.float));
    assertFalse(isBinary(TEST_VALUES.string));
    assertFalse(isBinary(TEST_VALUES.boolean));
    assertFalse(isBinary(TEST_VALUES.nullValue));
    assertFalse(isBinary(TEST_VALUES.undefinedValue));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isBinary.strict(TEST_VALUES.binaryZero);
    isBinary.strict(TEST_VALUES.binaryOne);

    // Invalid inputs throw
    assertThrows(() => isBinary.strict(TEST_VALUES.number));
    assertThrows(() => isBinary.strict(TEST_VALUES.float));
    assertThrows(() => isBinary.strict(TEST_VALUES.string));
  });

  await t.step("assert mode", () => {
    const assertIsBinary: typeof isBinary.assert = isBinary.assert;

    // Valid inputs don't throw
    assertIsBinary(TEST_VALUES.binaryZero);
    assertIsBinary(TEST_VALUES.binaryOne);

    // Invalid inputs throw
    assertThrows(() => assertIsBinary(TEST_VALUES.number));
    assertThrows(() => assertIsBinary(TEST_VALUES.string));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isBinary.optional(TEST_VALUES.binaryZero));
    assert(isBinary.optional(TEST_VALUES.binaryOne));
    assert(isBinary.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isBinary.optional(TEST_VALUES.number));
    assertFalse(isBinary.optional(TEST_VALUES.nullValue));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs (0 and 1 are not considered empty for binary)
    assert(isBinary.notEmpty(TEST_VALUES.binaryZero));
    assert(isBinary.notEmpty(TEST_VALUES.binaryOne));

    // Invalid inputs
    assertFalse(isBinary.notEmpty(TEST_VALUES.number));
    assertFalse(isBinary.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isBinary.notEmpty(TEST_VALUES.undefinedValue));
  });
});

Deno.test("isNumeric", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isNumeric(TEST_VALUES.number));
    assert(isNumeric(TEST_VALUES.zero));
    assert(isNumeric(TEST_VALUES.float));
    assert(isNumeric(TEST_VALUES.numericString));
    assert(isNumeric("0"));
    assert(isNumeric("-42"));
    assert(isNumeric("3.14"));

    // Invalid inputs
    assertFalse(isNumeric(TEST_VALUES.invalidNumericString));
    assertFalse(isNumeric(TEST_VALUES.emptyString));
    assertFalse(isNumeric(TEST_VALUES.boolean));
    assertFalse(isNumeric(TEST_VALUES.nullValue));
    assertFalse(isNumeric(TEST_VALUES.undefinedValue));
    assertFalse(isNumeric(TEST_VALUES.object));
    assertFalse(isNumeric(TEST_VALUES.array));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isNumeric.strict(TEST_VALUES.number);
    isNumeric.strict(TEST_VALUES.numericString);

    // Invalid inputs throw
    assertThrows(() => isNumeric.strict(TEST_VALUES.invalidNumericString));
    assertThrows(() => isNumeric.strict(TEST_VALUES.boolean));
  });

  await t.step("assert mode", () => {
    const assertIsNumeric: typeof isNumeric.assert = isNumeric.assert;

    // Valid inputs don't throw
    assertIsNumeric(TEST_VALUES.number);
    assertIsNumeric(TEST_VALUES.numericString);

    // Invalid inputs throw
    assertThrows(() => assertIsNumeric(TEST_VALUES.invalidNumericString));
    assertThrows(() => assertIsNumeric(TEST_VALUES.boolean));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isNumeric.optional(TEST_VALUES.number));
    assert(isNumeric.optional(TEST_VALUES.numericString));
    assert(isNumeric.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isNumeric.optional(TEST_VALUES.invalidNumericString));
    assertFalse(isNumeric.optional(TEST_VALUES.nullValue));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs
    assert(isNumeric.notEmpty(TEST_VALUES.number));
    assert(isNumeric.notEmpty(TEST_VALUES.numericString));

    // Invalid inputs
    assertFalse(isNumeric.notEmpty(TEST_VALUES.invalidNumericString));
    assertFalse(isNumeric.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isNumeric.notEmpty(TEST_VALUES.undefinedValue));
  });
});

Deno.test("isFunction", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isFunction(TEST_VALUES.function));
    assert(isFunction(() => {}));
    assert(isFunction(function () {}));
    assert(isFunction(Math.max));

    // Invalid inputs
    assertFalse(isFunction(TEST_VALUES.string));
    assertFalse(isFunction(TEST_VALUES.number));
    assertFalse(isFunction(TEST_VALUES.boolean));
    assertFalse(isFunction(TEST_VALUES.nullValue));
    assertFalse(isFunction(TEST_VALUES.undefinedValue));
    assertFalse(isFunction(TEST_VALUES.object));
    assertFalse(isFunction(TEST_VALUES.array));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isFunction.strict(TEST_VALUES.function);
    isFunction.strict(Math.max);

    // Invalid inputs throw
    assertThrows(() => isFunction.strict(TEST_VALUES.string));
    assertThrows(() => isFunction.strict(TEST_VALUES.number));
  });

  await t.step("assert mode", () => {
    const assertIsFunction: typeof isFunction.assert = isFunction.assert;

    // Valid inputs don't throw
    assertIsFunction(TEST_VALUES.function);
    assertIsFunction(Math.max);

    // Invalid inputs throw
    assertThrows(() => assertIsFunction(TEST_VALUES.string));
    assertThrows(() => assertIsFunction(TEST_VALUES.number));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isFunction.optional(TEST_VALUES.function));
    assert(isFunction.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isFunction.optional(TEST_VALUES.string));
    assertFalse(isFunction.optional(TEST_VALUES.nullValue));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs (functions are never considered empty)
    assert(isFunction.notEmpty(TEST_VALUES.function));
    assert(isFunction.notEmpty(Math.max));

    // Invalid inputs
    assertFalse(isFunction.notEmpty(TEST_VALUES.string));
    assertFalse(isFunction.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isFunction.notEmpty(TEST_VALUES.undefinedValue));
  });
});

// === Special Type Guards ===

Deno.test("isNull", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isNull(TEST_VALUES.nullValue));

    // Invalid inputs
    assertFalse(isNull(TEST_VALUES.undefinedValue));
    assertFalse(isNull(TEST_VALUES.string));
    assertFalse(isNull(TEST_VALUES.number));
    assertFalse(isNull(TEST_VALUES.zero));
    assertFalse(isNull(TEST_VALUES.boolean));
    assertFalse(isNull(TEST_VALUES.booleanFalse));
    assertFalse(isNull(TEST_VALUES.object));
    assertFalse(isNull(TEST_VALUES.array));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isNull.strict(TEST_VALUES.nullValue);

    // Invalid inputs throw
    assertThrows(() => isNull.strict(TEST_VALUES.undefinedValue));
    assertThrows(() => isNull.strict(TEST_VALUES.string));
    assertThrows(() => isNull.strict(TEST_VALUES.number));
    assertThrows(() => isNull.strict(TEST_VALUES.boolean));
  });

  await t.step("assert mode", () => {
    const assertIsNull: typeof isNull.assert = isNull.assert;

    // Valid inputs don't throw
    assertIsNull(TEST_VALUES.nullValue);

    // Invalid inputs throw
    assertThrows(() => assertIsNull(TEST_VALUES.undefinedValue));
    assertThrows(() => assertIsNull(TEST_VALUES.string));
    assertThrows(() => assertIsNull(TEST_VALUES.number));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isNull.optional(TEST_VALUES.nullValue));
    assert(isNull.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isNull.optional(TEST_VALUES.string));
    assertFalse(isNull.optional(TEST_VALUES.number));
    assertFalse(isNull.optional(TEST_VALUES.boolean));
    assertFalse(isNull.optional(TEST_VALUES.object));
  });
});

Deno.test("isUndefined", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isUndefined(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isUndefined(TEST_VALUES.nullValue));
    assertFalse(isUndefined(TEST_VALUES.string));
    assertFalse(isUndefined(TEST_VALUES.number));
    assertFalse(isUndefined(TEST_VALUES.zero));
    assertFalse(isUndefined(TEST_VALUES.boolean));
    assertFalse(isUndefined(TEST_VALUES.booleanFalse));
    assertFalse(isUndefined(TEST_VALUES.object));
    assertFalse(isUndefined(TEST_VALUES.array));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isUndefined.strict(TEST_VALUES.undefinedValue);

    // Invalid inputs throw
    assertThrows(() => isUndefined.strict(TEST_VALUES.nullValue));
    assertThrows(() => isUndefined.strict(TEST_VALUES.string));
    assertThrows(() => isUndefined.strict(TEST_VALUES.number));
  });

  await t.step("assert mode", () => {
    const assertIsUndefined: typeof isUndefined.assert = isUndefined.assert;

    // Valid inputs don't throw
    assertIsUndefined(TEST_VALUES.undefinedValue);

    // Invalid inputs throw
    assertThrows(() => assertIsUndefined(TEST_VALUES.nullValue));
    assertThrows(() => assertIsUndefined(TEST_VALUES.string));
  });

  await t.step("optional mode", () => {
    // Valid inputs (undefined optional is always undefined)
    assert(isUndefined.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isUndefined.optional(TEST_VALUES.nullValue));
    assertFalse(isUndefined.optional(TEST_VALUES.string));
    assertFalse(isUndefined.optional(TEST_VALUES.number));
  });
});

Deno.test("isNil", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isNil(TEST_VALUES.nullValue));
    assert(isNil(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isNil(TEST_VALUES.string));
    assertFalse(isNil(TEST_VALUES.emptyString));
    assertFalse(isNil(TEST_VALUES.number));
    assertFalse(isNil(TEST_VALUES.zero));
    assertFalse(isNil(TEST_VALUES.boolean));
    assertFalse(isNil(TEST_VALUES.booleanFalse));
    assertFalse(isNil(TEST_VALUES.object));
    assertFalse(isNil(TEST_VALUES.array));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isNil.strict(TEST_VALUES.nullValue);
    isNil.strict(TEST_VALUES.undefinedValue);

    // Invalid inputs throw
    assertThrows(() => isNil.strict(TEST_VALUES.string));
    assertThrows(() => isNil.strict(TEST_VALUES.number));
    assertThrows(() => isNil.strict(TEST_VALUES.boolean));
  });

  await t.step("assert mode", () => {
    const assertIsNil: typeof isNil.assert = isNil.assert;

    // Valid inputs don't throw
    assertIsNil(TEST_VALUES.nullValue);
    assertIsNil(TEST_VALUES.undefinedValue);

    // Invalid inputs throw
    assertThrows(() => assertIsNil(TEST_VALUES.string));
    assertThrows(() => assertIsNil(TEST_VALUES.number));
  });
});

Deno.test("isEmpty", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs (empty values)
    assert(isEmpty(TEST_VALUES.nullValue));
    assert(isEmpty(TEST_VALUES.undefinedValue));
    assert(isEmpty(TEST_VALUES.emptyString));
    assert(isEmpty(TEST_VALUES.emptyObject));
    assert(isEmpty(TEST_VALUES.emptyArray));

    // Invalid inputs (non-empty values)
    assertFalse(isEmpty(TEST_VALUES.string));
    assertFalse(isEmpty(TEST_VALUES.number));
    assertFalse(isEmpty(TEST_VALUES.zero)); // 0 is not considered empty for numbers
    assertFalse(isEmpty(TEST_VALUES.boolean));
    assertFalse(isEmpty(TEST_VALUES.booleanFalse)); // false is not empty
    assertFalse(isEmpty(TEST_VALUES.object));
    assertFalse(isEmpty(TEST_VALUES.array));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isEmpty.strict(TEST_VALUES.nullValue);
    isEmpty.strict(TEST_VALUES.undefinedValue);
    isEmpty.strict(TEST_VALUES.emptyString);
    isEmpty.strict(TEST_VALUES.emptyObject);
    isEmpty.strict(TEST_VALUES.emptyArray);

    // Invalid inputs throw
    assertThrows(() => isEmpty.strict(TEST_VALUES.string));
    assertThrows(() => isEmpty.strict(TEST_VALUES.number));
    assertThrows(() => isEmpty.strict(TEST_VALUES.boolean));
  });

  await t.step("assert mode", () => {
    const assertIsEmpty: typeof isEmpty.assert = isEmpty.assert;

    // Valid inputs don't throw
    assertIsEmpty(TEST_VALUES.nullValue);
    assertIsEmpty(TEST_VALUES.undefinedValue);
    assertIsEmpty(TEST_VALUES.emptyString);
    assertIsEmpty(TEST_VALUES.emptyObject);
    assertIsEmpty(TEST_VALUES.emptyArray);

    // Invalid inputs throw
    assertThrows(() => assertIsEmpty(TEST_VALUES.string));
    assertThrows(() => assertIsEmpty(TEST_VALUES.number));
  });
});

// === Complex Type Guards ===

Deno.test("isObject", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isObject(TEST_VALUES.object));
    assert(isObject(TEST_VALUES.emptyObject));
    assert(isObject(TEST_VALUES.date)); // Date objects are objects

    // Invalid inputs
    assertFalse(isObject(TEST_VALUES.array)); // Arrays are not objects in this guard
    assertFalse(isObject(TEST_VALUES.string));
    assertFalse(isObject(TEST_VALUES.number));
    assertFalse(isObject(TEST_VALUES.boolean));
    assertFalse(isObject(TEST_VALUES.nullValue));
    assertFalse(isObject(TEST_VALUES.undefinedValue));
    assertFalse(isObject(TEST_VALUES.function));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isObject.strict(TEST_VALUES.object);
    isObject.strict(TEST_VALUES.emptyObject);
    isObject.strict(TEST_VALUES.date);

    // Invalid inputs throw
    assertThrows(() => isObject.strict(TEST_VALUES.array));
    assertThrows(() => isObject.strict(TEST_VALUES.string));
    assertThrows(() => isObject.strict(TEST_VALUES.nullValue));
  });

  await t.step("assert mode", () => {
    const assertIsObject: typeof isObject.assert = isObject.assert;

    // Valid inputs don't throw
    assertIsObject(TEST_VALUES.object);
    assertIsObject(TEST_VALUES.emptyObject);
    assertIsObject(TEST_VALUES.date);

    // Invalid inputs throw
    assertThrows(() => assertIsObject(TEST_VALUES.array));
    assertThrows(() => assertIsObject(TEST_VALUES.string));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isObject.optional(TEST_VALUES.object));
    assert(isObject.optional(TEST_VALUES.emptyObject));
    assert(isObject.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isObject.optional(TEST_VALUES.array));
    assertFalse(isObject.optional(TEST_VALUES.nullValue));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs
    assert(isObject.notEmpty(TEST_VALUES.object));
    assert(isObject.notEmpty(TEST_VALUES.date)); // Date objects are not empty

    // Invalid inputs (empty object is considered empty)
    assertFalse(isObject.notEmpty(TEST_VALUES.emptyObject));
    assertFalse(isObject.notEmpty(TEST_VALUES.array));
    assertFalse(isObject.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isObject.notEmpty(TEST_VALUES.undefinedValue));
  });
});

Deno.test("isArray", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isArray(TEST_VALUES.array));
    assert(isArray(TEST_VALUES.emptyArray));
    assert(isArray(new Array(5)));

    // Invalid inputs
    assertFalse(isArray(TEST_VALUES.object));
    assertFalse(isArray(TEST_VALUES.string));
    assertFalse(isArray(TEST_VALUES.number));
    assertFalse(isArray(TEST_VALUES.boolean));
    assertFalse(isArray(TEST_VALUES.nullValue));
    assertFalse(isArray(TEST_VALUES.undefinedValue));
    assertFalse(isArray(TEST_VALUES.function));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isArray.strict(TEST_VALUES.array);
    isArray.strict(TEST_VALUES.emptyArray);

    // Invalid inputs throw
    assertThrows(() => isArray.strict(TEST_VALUES.object));
    assertThrows(() => isArray.strict(TEST_VALUES.string));
    assertThrows(() => isArray.strict(TEST_VALUES.nullValue));
  });

  await t.step("assert mode", () => {
    const assertIsArray: typeof isArray.assert = isArray.assert;

    // Valid inputs don't throw
    assertIsArray(TEST_VALUES.array);
    assertIsArray(TEST_VALUES.emptyArray);

    // Invalid inputs throw
    assertThrows(() => assertIsArray(TEST_VALUES.object));
    assertThrows(() => assertIsArray(TEST_VALUES.string));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isArray.optional(TEST_VALUES.array));
    assert(isArray.optional(TEST_VALUES.emptyArray));
    assert(isArray.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isArray.optional(TEST_VALUES.object));
    assertFalse(isArray.optional(TEST_VALUES.nullValue));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs
    assert(isArray.notEmpty(TEST_VALUES.array));

    // Invalid inputs (empty array is considered empty)
    assertFalse(isArray.notEmpty(TEST_VALUES.emptyArray));
    assertFalse(isArray.notEmpty(TEST_VALUES.object));
    assertFalse(isArray.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isArray.notEmpty(TEST_VALUES.undefinedValue));
  });
});

Deno.test("isDate", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isDate(TEST_VALUES.date));
    assert(isDate(new Date("2023-01-01")));
    assert(isDate(new Date("2023-01-01T00:00:00.000Z")));

    // Invalid inputs
    assertFalse(isDate("2023-01-01")); // String date
    assertFalse(isDate(1672531200000)); // Timestamp
    assertFalse(isDate(TEST_VALUES.object));
    assertFalse(isDate(TEST_VALUES.string));
    assertFalse(isDate(TEST_VALUES.number));
    assertFalse(isDate(TEST_VALUES.nullValue));
    assertFalse(isDate(TEST_VALUES.undefinedValue));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isDate.strict(TEST_VALUES.date);
    isDate.strict(new Date("2023-01-01"));

    // Invalid inputs throw
    assertThrows(() => isDate.strict("2023-01-01"));
    assertThrows(() => isDate.strict(1672531200000));
    assertThrows(() => isDate.strict(TEST_VALUES.object));
  });

  await t.step("assert mode", () => {
    const assertIsDate: typeof isDate.assert = isDate.assert;

    // Valid inputs don't throw
    assertIsDate(TEST_VALUES.date);
    assertIsDate(new Date("2023-01-01"));

    // Invalid inputs throw
    assertThrows(() => assertIsDate("2023-01-01"));
    assertThrows(() => assertIsDate(1672531200000));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isDate.optional(TEST_VALUES.date));
    assert(isDate.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isDate.optional("2023-01-01"));
    assertFalse(isDate.optional(TEST_VALUES.nullValue));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs (dates are never considered empty)
    assert(isDate.notEmpty(TEST_VALUES.date));
    assert(isDate.notEmpty(new Date("2023-01-01")));

    // Invalid inputs
    assertFalse(isDate.notEmpty("2023-01-01"));
    assertFalse(isDate.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isDate.notEmpty(TEST_VALUES.undefinedValue));
  });
});

Deno.test("isIterable", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isIterable(TEST_VALUES.iterator));
    assert(isIterable(TEST_VALUES.array)); // Arrays are iterable

    // Invalid inputs
    assertFalse(isIterable("string")); // Strings are iterable but this function requires objects
    assertFalse(isIterable(TEST_VALUES.object));
    assertFalse(isIterable(TEST_VALUES.number));
    assertFalse(isIterable(TEST_VALUES.boolean));
    assertFalse(isIterable(TEST_VALUES.nullValue));
    assertFalse(isIterable(TEST_VALUES.undefinedValue));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isIterable.strict(TEST_VALUES.iterator);
    isIterable.strict(TEST_VALUES.array);

    // Invalid inputs throw
    assertThrows(() => isIterable.strict(TEST_VALUES.object));
    assertThrows(() => isIterable.strict(TEST_VALUES.number));
    assertThrows(() => isIterable.strict(TEST_VALUES.nullValue));
  });

  await t.step("assert mode", () => {
    const assertIsIterable: typeof isIterable.assert = isIterable.assert;

    // Valid inputs don't throw
    assertIsIterable(TEST_VALUES.iterator);
    assertIsIterable(TEST_VALUES.array);

    // Invalid inputs throw
    assertThrows(() => assertIsIterable(TEST_VALUES.object));
    assertThrows(() => assertIsIterable(TEST_VALUES.number));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isIterable.optional(TEST_VALUES.iterator));
    assert(isIterable.optional(TEST_VALUES.array));
    assert(isIterable.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isIterable.optional(TEST_VALUES.object));
    assertFalse(isIterable.optional(TEST_VALUES.nullValue));
  });
});

Deno.test("isTuple", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isTuple([], 0));
    assert(isTuple([1], 1));
    assert(isTuple([1, 2], 2));
    assert(isTuple([1, 2, 3], 3));
    assert(isTuple(TEST_VALUES.array, 3)); // [1, 2, 3] has length 3

    // Invalid inputs
    assertFalse(isTuple([1, 2], 3)); // Wrong length
    assertFalse(isTuple([1, 2, 3], 2)); // Wrong length
    assertFalse(isTuple(TEST_VALUES.object, 0)); // Not an array
    assertFalse(isTuple(TEST_VALUES.string, 4)); // Not an array
    assertFalse(isTuple(TEST_VALUES.nullValue, 0));
    assertFalse(isTuple(TEST_VALUES.undefinedValue, 0));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isTuple.strict([], 0);
    isTuple.strict([1, 2], 2);
    isTuple.strict(TEST_VALUES.array, 3);

    // Invalid inputs throw
    assertThrows(() => isTuple.strict([1, 2], 3));
    assertThrows(() => isTuple.strict(TEST_VALUES.object, 0));
    assertThrows(() => isTuple.strict(TEST_VALUES.nullValue, 0));
  });

  await t.step("assert mode", () => {
    const assertIsTuple: typeof isTuple.assert = isTuple.assert;

    // Valid inputs don't throw
    assertIsTuple([], 0);
    assertIsTuple([1, 2], 2);
    assertIsTuple(TEST_VALUES.array, 3);

    // Invalid inputs throw
    assertThrows(() => assertIsTuple([1, 2], 3));
    assertThrows(() => assertIsTuple(TEST_VALUES.object, 0));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isTuple.optional([], 0));
    assert(isTuple.optional([1, 2], 2));
    assert(isTuple.optional(TEST_VALUES.undefinedValue, 5));

    // Invalid inputs
    assertFalse(isTuple.optional([1, 2], 3));
    assertFalse(isTuple.optional(TEST_VALUES.object, 0));
    assertFalse(isTuple.optional(TEST_VALUES.nullValue, 0));
  });
});

// === JSON Type Guards ===

Deno.test("isJsonPrimitive", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isJsonPrimitive(TEST_VALUES.boolean));
    assert(isJsonPrimitive(TEST_VALUES.booleanFalse));
    assert(isJsonPrimitive(TEST_VALUES.number));
    assert(isJsonPrimitive(TEST_VALUES.string));
    assert(isJsonPrimitive(TEST_VALUES.nullValue));

    // Invalid inputs
    assertFalse(isJsonPrimitive(TEST_VALUES.undefinedValue)); // undefined is not JSON
    assertFalse(isJsonPrimitive(TEST_VALUES.object));
    assertFalse(isJsonPrimitive(TEST_VALUES.array));
    assertFalse(isJsonPrimitive(TEST_VALUES.function));
    assertFalse(isJsonPrimitive(TEST_VALUES.date));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isJsonPrimitive.strict(TEST_VALUES.boolean);
    isJsonPrimitive.strict(TEST_VALUES.number);
    isJsonPrimitive.strict(TEST_VALUES.string);
    isJsonPrimitive.strict(TEST_VALUES.nullValue);

    // Invalid inputs throw
    assertThrows(() => isJsonPrimitive.strict(TEST_VALUES.undefinedValue));
    assertThrows(() => isJsonPrimitive.strict(TEST_VALUES.object));
    assertThrows(() => isJsonPrimitive.strict(TEST_VALUES.function));
  });

  await t.step("assert mode", () => {
    const assertIsJsonPrimitive: typeof isJsonPrimitive.assert = isJsonPrimitive.assert;

    // Valid inputs don't throw
    assertIsJsonPrimitive(TEST_VALUES.boolean);
    assertIsJsonPrimitive(TEST_VALUES.number);
    assertIsJsonPrimitive(TEST_VALUES.string);
    assertIsJsonPrimitive(TEST_VALUES.nullValue);

    // Invalid inputs throw
    assertThrows(() => assertIsJsonPrimitive(TEST_VALUES.undefinedValue));
    assertThrows(() => assertIsJsonPrimitive(TEST_VALUES.object));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isJsonPrimitive.optional(TEST_VALUES.boolean));
    assert(isJsonPrimitive.optional(TEST_VALUES.string));
    assert(isJsonPrimitive.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isJsonPrimitive.optional(TEST_VALUES.object));
    assertFalse(isJsonPrimitive.optional(TEST_VALUES.function));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs
    assert(isJsonPrimitive.notEmpty(TEST_VALUES.boolean));
    assert(isJsonPrimitive.notEmpty(TEST_VALUES.number));
    assert(isJsonPrimitive.notEmpty(TEST_VALUES.string));

    // Invalid inputs (null is considered empty)
    assertFalse(isJsonPrimitive.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isJsonPrimitive.notEmpty(TEST_VALUES.undefinedValue));
    assertFalse(isJsonPrimitive.notEmpty(TEST_VALUES.object));
  });
});

Deno.test("isJsonObject", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isJsonObject(TEST_VALUES.object));
    assert(isJsonObject(TEST_VALUES.emptyObject));
    assert(isJsonObject({ a: 1, b: "test", c: null, d: true }));

    // Invalid inputs
    assertFalse(isJsonObject(TEST_VALUES.array)); // Arrays are not objects
    assertFalse(isJsonObject(TEST_VALUES.string));
    assertFalse(isJsonObject(TEST_VALUES.number));
    assertFalse(isJsonObject(TEST_VALUES.nullValue));
    assertFalse(isJsonObject(TEST_VALUES.undefinedValue));
    assertFalse(isJsonObject(TEST_VALUES.date)); // Date objects are not JSON objects
    assertFalse(isJsonObject({ func: TEST_VALUES.function })); // Functions not allowed
    assertFalse(isJsonObject({ date: TEST_VALUES.date })); // Dates not allowed
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isJsonObject.strict(TEST_VALUES.object);
    isJsonObject.strict(TEST_VALUES.emptyObject);

    // Invalid inputs throw
    assertThrows(() => isJsonObject.strict(TEST_VALUES.array));
    assertThrows(() => isJsonObject.strict(TEST_VALUES.string));
    assertThrows(() => isJsonObject.strict({ func: TEST_VALUES.function }));
  });

  await t.step("assert mode", () => {
    const assertIsJsonObject: typeof isJsonObject.assert = isJsonObject.assert;

    // Valid inputs don't throw
    assertIsJsonObject(TEST_VALUES.object);
    assertIsJsonObject(TEST_VALUES.emptyObject);

    // Invalid inputs throw
    assertThrows(() => assertIsJsonObject(TEST_VALUES.array));
    assertThrows(() => assertIsJsonObject({ func: TEST_VALUES.function }));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isJsonObject.optional(TEST_VALUES.object));
    assert(isJsonObject.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isJsonObject.optional(TEST_VALUES.array));
    assertFalse(isJsonObject.optional(TEST_VALUES.nullValue));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs
    assert(isJsonObject.notEmpty(TEST_VALUES.object));

    // Invalid inputs (empty object is considered empty)
    assertFalse(isJsonObject.notEmpty(TEST_VALUES.emptyObject));
    assertFalse(isJsonObject.notEmpty(TEST_VALUES.array));
    assertFalse(isJsonObject.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isJsonObject.notEmpty(TEST_VALUES.undefinedValue));
  });
});

Deno.test("isJsonArray", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs
    assert(isJsonArray(TEST_VALUES.array));
    assert(isJsonArray(TEST_VALUES.emptyArray));
    assert(isJsonArray([1, "test", true, null]));

    // Invalid inputs
    assertFalse(isJsonArray(TEST_VALUES.object));
    assertFalse(isJsonArray(TEST_VALUES.string));
    assertFalse(isJsonArray(TEST_VALUES.number));
    assertFalse(isJsonArray(TEST_VALUES.boolean));
    assertFalse(isJsonArray(TEST_VALUES.nullValue));
    assertFalse(isJsonArray(TEST_VALUES.undefinedValue));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isJsonArray.strict(TEST_VALUES.array);
    isJsonArray.strict(TEST_VALUES.emptyArray);

    // Invalid inputs throw
    assertThrows(() => isJsonArray.strict(TEST_VALUES.object));
    assertThrows(() => isJsonArray.strict(TEST_VALUES.string));
    assertThrows(() => isJsonArray.strict(TEST_VALUES.nullValue));
  });

  await t.step("assert mode", () => {
    const assertIsJsonArray: typeof isJsonArray.assert = isJsonArray.assert;

    // Valid inputs don't throw
    assertIsJsonArray(TEST_VALUES.array);
    assertIsJsonArray(TEST_VALUES.emptyArray);

    // Invalid inputs throw
    assertThrows(() => assertIsJsonArray(TEST_VALUES.object));
    assertThrows(() => assertIsJsonArray(TEST_VALUES.string));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isJsonArray.optional(TEST_VALUES.array));
    assert(isJsonArray.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isJsonArray.optional(TEST_VALUES.object));
    assertFalse(isJsonArray.optional(TEST_VALUES.nullValue));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs
    assert(isJsonArray.notEmpty(TEST_VALUES.array));

    // Invalid inputs (empty array is considered empty)
    assertFalse(isJsonArray.notEmpty(TEST_VALUES.emptyArray));
    assertFalse(isJsonArray.notEmpty(TEST_VALUES.object));
    assertFalse(isJsonArray.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isJsonArray.notEmpty(TEST_VALUES.undefinedValue));
  });
});

Deno.test("isJsonValue", async (t) => {
  await t.step("basic functionality", () => {
    // Valid inputs - primitives
    assert(isJsonValue(TEST_VALUES.boolean));
    assert(isJsonValue(TEST_VALUES.number));
    assert(isJsonValue(TEST_VALUES.string));
    assert(isJsonValue(TEST_VALUES.nullValue));

    // Valid inputs - arrays and objects
    assert(isJsonValue(TEST_VALUES.array));
    assert(isJsonValue(TEST_VALUES.emptyArray));
    assert(isJsonValue(TEST_VALUES.object));
    assert(isJsonValue(TEST_VALUES.emptyObject));

    // Valid inputs - complex nested structures
    assert(isJsonValue({
      string: "value",
      number: 123,
      boolean: true,
      null: null,
      array: [1, "two", false, null],
      object: { nested: "value" },
    }));

    // Invalid inputs
    assertFalse(isJsonValue(TEST_VALUES.undefinedValue));
    assertFalse(isJsonValue(TEST_VALUES.function));
    assertFalse(isJsonValue(TEST_VALUES.date));
    assertFalse(isJsonValue({ func: TEST_VALUES.function }));
    assertFalse(isJsonValue({ date: TEST_VALUES.date }));
    assertFalse(isJsonValue({ nested: { undef: TEST_VALUES.undefinedValue } }));
  });

  await t.step("strict mode", () => {
    // Valid inputs don't throw
    isJsonValue.strict(TEST_VALUES.boolean);
    isJsonValue.strict(TEST_VALUES.array);
    isJsonValue.strict(TEST_VALUES.object);

    // Invalid inputs throw
    assertThrows(() => isJsonValue.strict(TEST_VALUES.undefinedValue));
    assertThrows(() => isJsonValue.strict(TEST_VALUES.function));
    assertThrows(() => isJsonValue.strict({ func: TEST_VALUES.function }));
  });

  await t.step("assert mode", () => {
    const assertIsJsonValue: typeof isJsonValue.assert = isJsonValue.assert;

    // Valid inputs don't throw
    assertIsJsonValue(TEST_VALUES.boolean);
    assertIsJsonValue(TEST_VALUES.array);
    assertIsJsonValue(TEST_VALUES.object);

    // Invalid inputs throw
    assertThrows(() => assertIsJsonValue(TEST_VALUES.undefinedValue));
    assertThrows(() => assertIsJsonValue({ func: TEST_VALUES.function }));
  });

  await t.step("optional mode", () => {
    // Valid inputs
    assert(isJsonValue.optional(TEST_VALUES.boolean));
    assert(isJsonValue.optional(TEST_VALUES.array));
    assert(isJsonValue.optional(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isJsonValue.optional(TEST_VALUES.function));
    assertFalse(isJsonValue.optional({ func: TEST_VALUES.function }));
  });

  await t.step("notEmpty mode", () => {
    // Valid inputs
    assert(isJsonValue.notEmpty(TEST_VALUES.boolean));
    assert(isJsonValue.notEmpty(TEST_VALUES.number));
    assert(isJsonValue.notEmpty(TEST_VALUES.string));
    assert(isJsonValue.notEmpty(TEST_VALUES.array));
    assert(isJsonValue.notEmpty(TEST_VALUES.object));

    // Invalid inputs (empty values)
    assertFalse(isJsonValue.notEmpty(TEST_VALUES.nullValue));
    assertFalse(isJsonValue.notEmpty(TEST_VALUES.undefinedValue));
    assertFalse(isJsonValue.notEmpty(TEST_VALUES.emptyString));
    assertFalse(isJsonValue.notEmpty(TEST_VALUES.emptyArray));
    assertFalse(isJsonValue.notEmpty(TEST_VALUES.emptyObject));
    assertFalse(isJsonValue.notEmpty(TEST_VALUES.function));
  });
});

// === Utility Functions ===

Deno.test("createTypeGuard", async (t) => {
  await t.step("basic functionality with helper injection", () => {
    const testGuard = createTypeGuard<{ a: string }>((v, { has }) => {
      if (isObject(v) && has(v, "a", isString)) {
        return v;
      }
      return null;
    });

    assertEquals(testGuard({ a: "test" }), true);
    assertEquals(testGuard({}), false);
    assertEquals(testGuard({ a: 123 }), false);
  });

  await t.step("includes helper injection", () => {
    const validValues = ["red", "green", "blue"] as const;
    const colorGuard = createTypeGuard<typeof validValues[number]>((v, { includes }) => {
      if (includes(validValues, v)) return v;
      return null;
    });

    assert(colorGuard("red"));
    assert(colorGuard("green"));
    assert(colorGuard("blue"));
    assertFalse(colorGuard("yellow"));
    assertFalse(colorGuard(123));
    assertFalse(colorGuard(null));
  });

  await t.step("custom complex parser", () => {
    // Custom type guard for positive integers
    const isPositiveInteger = createTypeGuard<number>((val) => {
      if (typeof val !== "number") return null;
      if (!Number.isInteger(val)) return null;
      if (val <= 0) return null;
      return val;
    });

    assert(isPositiveInteger(1));
    assert(isPositiveInteger(42));
    assertFalse(isPositiveInteger(0));
    assertFalse(isPositiveInteger(-1));
    assertFalse(isPositiveInteger(3.14));
    assertFalse(isPositiveInteger("5"));

    // Test all modes
    isPositiveInteger.strict(5);
    assertThrows(() => isPositiveInteger.strict(-5));

    assert(isPositiveInteger.optional(10));
    assert(isPositiveInteger.optional(TEST_VALUES.undefinedValue));
    assertFalse(isPositiveInteger.optional(-5));

    assert(isPositiveInteger.notEmpty(10));
    assertFalse(isPositiveInteger.notEmpty(0));
  });

  await t.step("or method - union type guards", () => {
    // Create a union type guard for string | number
    const isStringOrNumber = isString.or(isNumber);

    // Valid inputs - strings
    assert(isStringOrNumber(TEST_VALUES.string));
    assert(isStringOrNumber(TEST_VALUES.emptyString));

    // Valid inputs - numbers
    assert(isStringOrNumber(TEST_VALUES.number));
    assert(isStringOrNumber(TEST_VALUES.zero));
    assert(isStringOrNumber(TEST_VALUES.float));

    // Invalid inputs
    assertFalse(isStringOrNumber(TEST_VALUES.boolean));
    assertFalse(isStringOrNumber(TEST_VALUES.nullValue));
    assertFalse(isStringOrNumber(TEST_VALUES.undefinedValue));
    assertFalse(isStringOrNumber(TEST_VALUES.object));
    assertFalse(isStringOrNumber(TEST_VALUES.array));
  });

  await t.step("or method - complex union types", () => {
    // Create a union type guard for boolean | null | undefined
    const isBooleanOrNil = isBoolean.or(isNil);

    // Valid inputs
    assert(isBooleanOrNil(TEST_VALUES.boolean));
    assert(isBooleanOrNil(TEST_VALUES.booleanFalse));
    assert(isBooleanOrNil(TEST_VALUES.nullValue));
    assert(isBooleanOrNil(TEST_VALUES.undefinedValue));

    // Invalid inputs
    assertFalse(isBooleanOrNil(TEST_VALUES.string));
    assertFalse(isBooleanOrNil(TEST_VALUES.number));
    assertFalse(isBooleanOrNil(TEST_VALUES.object));
    assertFalse(isBooleanOrNil(TEST_VALUES.array));
  });

  await t.step("or method - chained unions", () => {
    // Create a union type guard for string | number | boolean
    const isStringOrNumberOrBoolean = isString.or(isNumber).or(isBoolean);

    // Valid inputs
    assert(isStringOrNumberOrBoolean(TEST_VALUES.string));
    assert(isStringOrNumberOrBoolean(TEST_VALUES.number));
    assert(isStringOrNumberOrBoolean(TEST_VALUES.boolean));
    assert(isStringOrNumberOrBoolean(TEST_VALUES.booleanFalse));

    // Invalid inputs
    assertFalse(isStringOrNumberOrBoolean(TEST_VALUES.nullValue));
    assertFalse(isStringOrNumberOrBoolean(TEST_VALUES.undefinedValue));
    assertFalse(isStringOrNumberOrBoolean(TEST_VALUES.object));
    assertFalse(isStringOrNumberOrBoolean(TEST_VALUES.array));
  });

  await t.step("or method - with custom type guards", () => {
    // Custom type guard for positive numbers
    const isPositive = createTypeGuard<number>((val) => {
      if (typeof val !== "number" || val <= 0) return null;
      return val;
    });

    // Custom type guard for negative numbers
    const isNegative = createTypeGuard<number>((val) => {
      if (typeof val !== "number" || val >= 0) return null;
      return val;
    });

    // Create union for positive or negative (excludes zero)
    const isNonZero = isPositive.or(isNegative);

    // Valid inputs
    assert(isNonZero(TEST_VALUES.number)); // 42
    assert(isNonZero(-10));
    assert(isNonZero(3.14));
    assert(isNonZero(-3.14));

    // Invalid inputs
    assertFalse(isNonZero(TEST_VALUES.zero));
    assertFalse(isNonZero(TEST_VALUES.string));
    assertFalse(isNonZero(TEST_VALUES.nullValue));
  });

  await t.step("or method - all modes work on union guards", () => {
    const isStringOrNumber = isString.or(isNumber);

    // Strict mode
    isStringOrNumber.strict(TEST_VALUES.string);
    isStringOrNumber.strict(TEST_VALUES.number);
    assertThrows(() => isStringOrNumber.strict(TEST_VALUES.boolean));
    assertThrows(() => isStringOrNumber.strict(TEST_VALUES.nullValue));

    // Assert mode
    const assertIsStringOrNumber: typeof isStringOrNumber.assert = isStringOrNumber.assert;
    assertIsStringOrNumber(TEST_VALUES.string);
    assertIsStringOrNumber(TEST_VALUES.number);
    assertThrows(() => assertIsStringOrNumber(TEST_VALUES.boolean));

    // Optional mode
    assert(isStringOrNumber.optional(TEST_VALUES.string));
    assert(isStringOrNumber.optional(TEST_VALUES.number));
    assert(isStringOrNumber.optional(TEST_VALUES.undefinedValue));
    assertFalse(isStringOrNumber.optional(TEST_VALUES.boolean));
    assertFalse(isStringOrNumber.optional(TEST_VALUES.nullValue));

    // NotEmpty mode
    assert(isStringOrNumber.notEmpty(TEST_VALUES.string));
    assert(isStringOrNumber.notEmpty(TEST_VALUES.number));
    assertFalse(isStringOrNumber.notEmpty(TEST_VALUES.emptyString));
    assertFalse(isStringOrNumber.notEmpty(TEST_VALUES.boolean));
    assertFalse(isStringOrNumber.notEmpty(TEST_VALUES.nullValue));
  });
});

Deno.test("hasProperty", async (t) => {
  await t.step("property existence check", () => {
    const obj = { a: 1, b: "test", c: null };

    assert(hasProperty(obj, "a"));
    assert(hasProperty(obj, "b"));
    assert(hasProperty(obj, "c"));
    assertFalse(hasProperty(obj, "d"));
  });

  await t.step("property existence with type guard", () => {
    const obj = { a: 1, b: "test", c: null };

    assert(hasProperty(obj, "a", isNumber));
    assert(hasProperty(obj, "b", isString));
    assert(hasProperty(obj, "c", isNull));

    assertFalse(hasProperty(obj, "a", isString));
    assertFalse(hasProperty(obj, "b", isNumber));
    assertFalse(hasProperty(obj, "d", isString));
  });
});

Deno.test("hasOptionalProperty", async (t) => {
  await t.step("optional property with undefined", () => {
    const obj = { a: 1, b: undefined };

    assert(hasOptionalProperty(obj, "a", isNumber));
    assert(hasOptionalProperty(obj, "b")); // undefined is valid for optional
    assert(hasOptionalProperty(obj, "b", isString)); // undefined passes optional check
  });

  await t.step("optional property type validation", () => {
    const obj = { a: 1, b: "test" };

    assert(hasOptionalProperty(obj, "a", isNumber));
    assert(hasOptionalProperty(obj, "b", isString));
    assertFalse(hasOptionalProperty(obj, "a", isString));
    assertFalse(hasOptionalProperty(obj, "b", isNumber));
  });
});

Deno.test("tupleHas", async (t) => {
  await t.step("tuple index validation", () => {
    const tuple = [1, "test", true] as const;

    assert(tupleHas(tuple, 0, isNumber));
    assert(tupleHas(tuple, 1, isString));
    assert(tupleHas(tuple, 2, isBoolean));

    assertFalse(tupleHas(tuple, 0, isString));
    assertFalse(tupleHas(tuple, 1, isNumber));
    assertFalse(tupleHas(tuple, 3, isString)); // Index out of bounds
  });
});

Deno.test("includes", async (t) => {
  await t.step("array membership check", () => {
    const arr = [1, 2, 3] as const;

    assert(includes(arr, 1));
    assert(includes(arr, 2));
    assert(includes(arr, 3));

    assertFalse(includes(arr, 4));
    assertFalse(includes(arr, "1")); // Type matters
    assertFalse(includes(arr, null));
  });

  await t.step("string array membership", () => {
    const colors = ["red", "green", "blue"] as const;

    assert(includes(colors, "red"));
    assert(includes(colors, "green"));
    assert(includes(colors, "blue"));

    assertFalse(includes(colors, "yellow"));
    assertFalse(includes(colors, "Red")); // Case sensitive
  });
});
