import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import {
  createTypeGuard,
  hasProperty,
  includes,
  isArray,
  isBinary,
  isBoolean,
  isEmpty,
  isFunction,
  isIterator,
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

Deno.test("createTypeGuard", async (t) => {
  await t.step('injects "has" function', () => {
    const testGuard = createTypeGuard<{ a: string }>((v, { has }) => {
      if (isObject(v) && has(v, "a", isString)) {
        return v;
      }

      return null;
    });

    assertEquals(testGuard({ a: "1" }), true);
    assertEquals(testGuard({}), false);
  });

  await t.step('injects "includes" function', () => {
    const tuple = ["a", "b", "c"] as const;

    const testGuard = createTypeGuard<typeof tuple[number]>(
      (v, { includes }) => {
        if (includes(tuple, v)) return v;

        return null;
      },
    );

    assertEquals(testGuard("a"), true);
    assertEquals(testGuard("f"), false);
    assertEquals(testGuard([]), false);
    assertEquals(testGuard({}), false);
    assertEquals(testGuard(1), false);
    assertEquals(testGuard(0), false);
    assertEquals(testGuard(true), false);
    assertEquals(testGuard(false), false);
    assertEquals(testGuard(null), false);
    assertEquals(testGuard(undefined), false);
  });
});

Deno.test("isBoolean", async (t) => {
  await t.step("returns true only on boolean value types", () => {
    assert(isBoolean(true));
    assert(isBoolean(false));

    assertFalse(isBoolean(0));
    assertFalse(isBoolean(null));
    assertFalse(isBoolean(undefined));
    assertFalse(isBoolean("a"));
    assertFalse(isBoolean({}));
    assertFalse(isBoolean([]));
  });
});

Deno.test("isString", async (t) => {
  await t.step("returns true only on string value types", () => {
    assert(isString("a"));
    assert(isString(""));

    assertFalse(isString(0));
    assertFalse(isString(null));
    assertFalse(isString(undefined));
    assertFalse(isString(true));
    assertFalse(isString({}));
    assertFalse(isString([]));
  });
});

Deno.test("isNumber", async (t) => {
  await t.step("returns true only on numeric value types", () => {
    assert(isNumber(0));
    assert(isNumber(100));
    assert(isNumber(0.1));

    assertFalse(isNumber("a"));
    assertFalse(isNumber(null));
    assertFalse(isNumber(undefined));
    assertFalse(isNumber(true));
    assertFalse(isNumber({}));
    assertFalse(isNumber([]));
  });
});

Deno.test("isBinary", async (t) => {
  await t.step("returns true only on values of 1 or 0", () => {
    assert(isBinary(0));
    assert(isBinary(1));

    assertFalse(isBinary(2));
    assertFalse(isBinary(0.1));
    assertFalse(isBinary("a"));
    assertFalse(isBinary(null));
    assertFalse(isBinary(undefined));
    assertFalse(isBinary(true));
    assertFalse(isBinary({}));
    assertFalse(isBinary([]));
  });
});

Deno.test("isFunction", async (t) => {
  await t.step("returns true only on function type values", () => {
    assert(isFunction(() => {}));

    assertFalse(isFunction(true));
    assertFalse(isFunction(false));
    assertFalse(isFunction(0));
    assertFalse(isFunction(null));
    assertFalse(isFunction(undefined));
    assertFalse(isFunction("a"));
    assertFalse(isFunction({}));
    assertFalse(isFunction([]));
  });
});

Deno.test("isJsonArray", async (t) => {
  await t.step("returns true only on array type values", () => {
    assert(isJsonArray([]));

    assertFalse(isJsonArray(true));
    assertFalse(isJsonArray(false));
    assertFalse(isJsonArray(0));
    assertFalse(isJsonArray(null));
    assertFalse(isJsonArray(undefined));
    assertFalse(isJsonArray("a"));
    assertFalse(isJsonArray({}));
  });
});

Deno.test("isJsonObject", async (t) => {
  await t.step("returns true only on object type values", () => {
    assert(isJsonObject({}));

    assertFalse(isJsonObject(true));
    assertFalse(isJsonObject(false));
    assertFalse(isJsonObject(0));
    assertFalse(isJsonObject(null));
    assertFalse(isJsonObject(undefined));
    assertFalse(isJsonObject([]));
  });
});

Deno.test("isNull", async (t) => {
  await t.step("returns true only on null values", () => {
    assert(isNull(null));

    assertFalse(isNull(true));
    assertFalse(isNull(false));
    assertFalse(isNull(0));
    assertFalse(isNull(undefined));
    assertFalse(isNull("a"));
    assertFalse(isNull({}));
    assertFalse(isNull([]));
  });

  await t.step("strict mode", () => {
    isNull.strict(null);
    assertThrows(() => isNull.strict(true));
    assertThrows(() => isNull.strict(false));
    assertThrows(() => isNull.strict(0));
    assertThrows(() => isNull.strict("a"));
    assertThrows(() => isNull.strict({}));
    assertThrows(() => isNull.strict([]));
  });
});

Deno.test("isUndefined", async (t) => {
  await t.step("returns true only on undefined values", () => {
    assert(isUndefined(undefined));

    assertFalse(isUndefined(true));
    assertFalse(isUndefined(false));
    assertFalse(isUndefined(0));
    assertFalse(isUndefined(null));
    assertFalse(isUndefined("a"));
    assertFalse(isUndefined({}));
    assertFalse(isUndefined([]));
  });
});

Deno.test("isEmpty", async (t) => {
  await t.step(
    "returns true only on null, undefined, or empty string values",
    () => {
      assert(isEmpty(null));
      assert(isEmpty(undefined));
      assert(isEmpty(""));
      assert(isEmpty({}));
      assert(isEmpty([]));

      assertFalse(isEmpty(true));
      assertFalse(isEmpty(false));
      assertFalse(isEmpty(0));
      assertFalse(isEmpty("a"));
    },
  );

  await t.step("strict mode", () => {
    isEmpty.strict(null);
    isEmpty.strict(undefined);
    isEmpty.strict("");
    isEmpty.strict({});
    isEmpty.strict([]);
    assertThrows(() => isEmpty.strict(true));
    assertThrows(() => isEmpty.strict(false));
    assertThrows(() => isEmpty.strict(0));
    assertThrows(() => isEmpty.strict("a"));
  });
});

Deno.test("isNil", async (t) => {
  await t.step("returns true only on null or undefined values", () => {
    assert(isNil(null));
    assert(isNil(undefined));
    assertFalse(isNil(true));
    assertFalse(isNil(false));
    assertFalse(isNil(0));
    assertFalse(isNil("a"));
    assertFalse(isNil({}));
    assertFalse(isNil([]));
  });

  await t.step("strict mode", () => {
    isNil.strict(null);
    isNil.strict(undefined);
    assertThrows(() => isNil.strict(true));
    assertThrows(() => isNil.strict(false));
    assertThrows(() => isNil.strict(0));
    assertThrows(() => isNil.strict("a"));
    assertThrows(() => isNil.strict({}));
    assertThrows(() => isNil.strict([]));
  });
});

Deno.test("strict mode", async (t) => {
  await t.step("throws on failed typeguard", () => {
    assertThrows(() => isBoolean.strict("a"));
    assertThrows(() => isBoolean.strict(1));
    assertThrows(() => isBoolean.strict(null));
    assertThrows(() => isBoolean.strict(undefined));
    assertThrows(() => isBoolean.strict({}));
  });

  await t.step("does not throw on successful typeguard", () => {
    isBoolean.strict(true);
    isBoolean.strict(false);
    isNumber.strict(0);
    isString.strict("1");
  });
});

Deno.test("notEmpty", () => {
  assert(isString.notEmpty("a string"));

  assertFalse(isString.notEmpty(0));
  assertFalse(isString.notEmpty(10));
  assertFalse(isString.notEmpty(""));
});

Deno.test("isTuple", () => {
  assert(isTuple([], 0));
  assert(isTuple([1], 1));
  assert(isTuple([1, 2], 2));
  assert(isTuple([1, 2, 3], 3));
  assert(isTuple([1, 2, 3, 4], 4));
  assert(isTuple([1, 2, 3, 4, 5], 5));
  assert(isTuple([1, 2, 3, 4, 5, 6], 6));
  assert(isTuple([1, 2, 3, 4, 5, 6, 7], 7));
  assert(isTuple([1, 2, 3, 4, 5, 6, 7, 8], 8));
  assert(isTuple([1, 2, 3, 4, 5, 6, 7, 8, 9], 9));
  assert(isTuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10));
  assertFalse(isTuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10));
  assertFalse(isTuple([1, 2, 3, 4, 5, 6, 7, 8, 9], 10));
});
Deno.test("hasProperty", async (t) => {
  await t.step("returns true if property exists", () => {
    const obj = { a: 1, b: "test" };
    assert(hasProperty(obj, "a"));
    assert(hasProperty(obj, "b"));
    assertFalse(hasProperty(obj, "c"));
  });

  await t.step("returns true if property exists and passes guard", () => {
    const obj = { a: 1, b: "test" };
    assert(hasProperty(obj, "a", isNumber));
    assertFalse(hasProperty(obj, "b", isNumber));
    assert(hasProperty(obj, "b", isString));
    assertFalse(hasProperty(obj, "c", isString));
  });
});

Deno.test("tupleHas", async (t) => {
  await t.step("returns true if index exists and passes guard", () => {
    const tuple = [1, "a", true] as const;
    assert(tupleHas(tuple, 0, isNumber));
    assert(tupleHas(tuple, 1, isString));
    assert(tupleHas(tuple, 2, isBoolean));
    assertFalse(tupleHas(tuple, 1, isNumber));
    assertFalse(tupleHas(tuple, 3, isString));
  });
});

Deno.test("includes", () => {
  const arr = [1, 2, 3] as const;
  assert(includes(arr, 1));
  assert(includes(arr, 2));
  assertFalse(includes(arr, 4));
  assertFalse(includes(arr, "1"));
});

Deno.test("isNumeric", async (t) => {
  await t.step("returns true for numbers and numeric strings", () => {
    assert(isNumeric(1));
    assert(isNumeric(0));
    assert(isNumeric("42"));
    assert(isNumeric("3.14"));
  });

  await t.step("returns false for non-numeric values", () => {
    assertFalse(isNumeric("abc"));
    assertFalse(isNumeric({}));
    assertFalse(isNumeric([]));
    assertFalse(isNumeric(null));
    assertFalse(isNumeric(undefined));
  });
});

Deno.test("isJsonPrimitive", () => {
  assert(isJsonPrimitive(true));
  assert(isJsonPrimitive(false));
  assert(isJsonPrimitive(1));
  assert(isJsonPrimitive("str"));
  assert(isJsonPrimitive(null));
  assertFalse(isJsonPrimitive(undefined));
  assertFalse(isJsonPrimitive({}));
  assertFalse(isJsonPrimitive([]));
});

Deno.test("isObject", () => {
  assert(isObject({}));
  assert(isObject({ a: 1 }));
  assertFalse(isObject([]));
  assertFalse(isObject(null));
  assertFalse(isObject("str"));
  assertFalse(isObject(1));
});

Deno.test("isArray", () => {
  assert(isArray([]));
  assert(isArray([1, 2, 3]));
  assertFalse(isArray({}));
  assertFalse(isArray("str"));
  assertFalse(isArray(1));
  assertFalse(isArray(null));
});

Deno.test("isJsonValue", () => {
  assert(isJsonValue(true));
  assert(isJsonValue(1));
  assert(isJsonValue("str"));
  assert(isJsonValue([]));
  assert(isJsonValue([1, 2, 3]));
  assert(isJsonValue({}));
  assert(isJsonValue({ a: 1, b: "str", c: null }));
  assertFalse(isJsonValue(undefined));
  assertFalse(isJsonValue({ a: undefined }));
  assertFalse(isJsonValue({ a: () => {} }));
});

Deno.test("isIterator", async (t) => {
  await t.step("returns true for iterators", () => {
    const arr = [1, 2, 3];
    const iter = arr[Symbol.iterator]();
    assert(isIterator(iter));
  });

  await t.step("returns false for non-iterators", () => {
    assertFalse(isIterator({}));
    assertFalse(isIterator(null));
    assertFalse(isIterator(undefined));
    assertFalse(isIterator("str"));
  });

  await t.step("strict mode throws on non-iterators", () => {
    const arr = [1, 2, 3];
    const iter = arr[Symbol.iterator]();
    isIterator.strict(iter);
    assertThrows(() => isIterator.strict({}));
    assertThrows(() => isIterator.strict(null));
    assertThrows(() => isIterator.strict(undefined));
    assertThrows(() => isIterator.strict("str"));
  });
});
