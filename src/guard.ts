/**
 * guard.ts
 * @module
 */

import type {
  JsonArray,
  JsonObject,
  JsonPrimitive,
  JsonValue,
} from "./types.ts";

/** A parser is a function that takes an unknown and returns T or null */
export type Parser<T = unknown> = (
  val: unknown,
  has: typeof hasProperty,
) => T | null;

/**
 * Utility to verify if a property exists in an object. Checks that
 * k is a key in t. If a guard method is provided, it will also check
 * that the value at k passes the guard.
 * @param {object} t The object to check for property k.
 * @param {string|number|Symbol} k The key for property k.
 * @param {Function|undefined} guard The optional type guard to validate t[k].
 * @returns {boolean}
 */
export function hasProperty<K extends PropertyKey, G = unknown>(
  t: object,
  k: K,
  guard?: (v: unknown) => v is G,
): t is { [K2 in K]: G } {
  if (!(k in t)) return false;

  return guard ? guard(t[k as keyof typeof t]) : true;
}

/**
 * Creates a type guard that strictly checks the type, throwing
 *  a TypeError if it fails.
 * @param parse
 * @returns
 */
const createStrictTypeGuard = <T>(parse: Parser<T>) => {
  return (value: unknown, errorMsg?: string): asserts value is T => {
    if (parse(value, hasProperty) === null) {
      throw TypeError(
        errorMsg ?? `Type guard failed. Parser ${parse.name} returned null.`,
      );
    }
  };
};

/**
 * Creates a type guard that fails if the value is considered
 * "empty" by the `isEmpty` type guard.
 * @param parse
 * @returns
 */
const createNotEmptyTypeGuard = <T>(
  parse: Parser<T>,
): TypeGuard<T>["notEmpty"] => {
  const callback = (value: unknown): value is T =>
    !isEmpty(value) && parse(value, hasProperty) !== null;

  /**
   * Throws a TypeError if the type guard fails or value is empty.
   * Optionally you may define an error message to be included.
   * @param {unknown} value
   * @param {string?} errorMsg Optional
   * @returns
   */
  callback.strict = createStrictTypeGuard(parse);

  return callback;
};

type StrictTypeGuard<T> = (
  value: unknown,
  errorMsg?: string,
) => asserts value is T;

export type TypeGuard<T> = {
  (value: unknown): value is T;
  strict: StrictTypeGuard<T>;
  notEmpty: {
    (value: unknown): value is T;
    strict: StrictTypeGuard<T>;
  };
};

/**
 * The createTypeGuard function accepts a parser and returns a new function that
 * can be used to validate an input against a specified type. The parser
 * should perform whatever checks are necessary to safely establish that
 * the input is of the specified type.
 *
 * e.g.
 * ```
 * const parseString = (val: unknown): string | null => typeof val === 'string' ? val : null;
 * const isString = createTypeGuard(parseString);
 * ```
 *
 * Injects the `has` utility method as the second argument of any parser, as
 * a convenience to check if a property exists in an object.
 *
 * @param {Function} parse
 * @returns {Function}
 */
export const createTypeGuard = <T>(parse: Parser<T>): TypeGuard<T> => {
  const callback = (value: unknown): value is T =>
    parse(value, hasProperty) !== null;

  /**
   * Throws a TypeError if the type guard fails. Optionally you may define an
   * error message to be included.
   * @param {unknown} value
   * @param {string?} errorMsg Optional
   * @returns
   */
  callback.strict = createStrictTypeGuard(parse);

  /**
   * Returns false if the value fails the "empty" type guard
   * or if it fails the parser.
   * @param {unknown} value
   * @returns
   */
  callback.notEmpty = createNotEmptyTypeGuard(parse);

  return callback;
};

/**
 * Returns true if input satisfies type boolean.
 * @param {unknown} t
 * @return {boolean}
 */
export const isBoolean: TypeGuard<boolean> = createTypeGuard((
  t,
): boolean | null => typeof t === "boolean" ? t : null);

/**
 * Returns true if input satisfies type string.
 * @param {unknown} t
 * @return {boolean}
 */
export const isString: TypeGuard<string> = createTypeGuard((t): string | null =>
  typeof t === "string" ? t : null
);

/**
 * Returns true if input satisfies type number.
 * @param {unknown} t
 * @return {boolean}
 */
export const isNumber: TypeGuard<number> = createTypeGuard((t): number | null =>
  typeof t === "number" ? t : null
);

/**
 * Returns true if input satisfies type binary.
 * @param {unknown} t
 * @return {boolean}
 */
export const isBinary: TypeGuard<0 | 1> = createTypeGuard((t): 0 | 1 | null =>
  t === 1 || t === 0 ? t : null
);

/**
 * Returns true if input satisfies type numeric.
 * @param {unknown} t
 * @return {boolean}
 */
export const isNumeric: TypeGuard<number> = createTypeGuard(
  (t): number | null => {
    if (isNumber(t)) return t as number;

    const _t = parseInt(t as string) || parseFloat(t as string);

    return !isNaN(_t) && isNumber(_t) ? t as number : null;
  },
);

/**
 * Returns true if input satisfies type Function.
 * @param {unknown} t
 * @return {boolean}
 */
export const isFunction: TypeGuard<Function> = createTypeGuard((
  t,
): Function | null => typeof t === "function" ? t : null);

/**
 * Returns true if input satisfies type undefined.
 * @param {unknown} t
 * @return {boolean}
 */
export const isUndefined: TypeGuard<undefined> = createTypeGuard((
  t,
): undefined | null => typeof t === "undefined" ? t : null);

/**
 * Returns true if input is a JSON-able primitive date type
 * @param {unknown} t
 * @return {boolean}
 */
export const isJsonPrimitive: TypeGuard<JsonPrimitive> = createTypeGuard((
  t,
): JsonPrimitive | null =>
  isBoolean(t) || isString(t) || isNumber(t) || isNull(t)
);

/**
 * Returns true if input satisfies type object. _BEWARE_ object
 * can apply to many different types, including arrays. This
 * is not as type safe as you might think.
 * @param {unknown} t
 * @return {boolean}
 */
export const isObject: TypeGuard<object> = createTypeGuard((t): object | null =>
  t && typeof t === "object" && !Array.isArray(t) ? t : null
);

/**
 * Returns true if input satisfies type object. _BEWARE_ object
 * can apply to many different types, including arrays. This
 * is not as type safe as you might think.
 * @param {unknown} t
 * @return {boolean}
 */
export const isJsonObject: TypeGuard<JsonObject> = createTypeGuard(
  (t): JsonObject | null => {
    if (t && typeof t === "object" && !Array.isArray(t)) {
      for (const v of Object.values(t)) {
        if (!isJsonValue(v)) return null;
      }

      return t as JsonObject;
    }

    return null;
  },
);

/**
 * Returns true if input satisfies type array.
 * @param {unknown} t
 * @return {boolean}
 */
export const isArray: TypeGuard<unknown[]> = createTypeGuard((
  t,
): unknown[] | null => Array.isArray(t) ? t : null);

/**
 * Returns true if input satisfies type array.
 * @param {unknown} t
 * @return {boolean}
 */
export const isJsonArray: TypeGuard<JsonArray> = createTypeGuard((
  t,
): JsonArray | null => Array.isArray(t) ? t : null);

export const isJsonValue: TypeGuard<JsonValue> = createTypeGuard(
  (t): JsonValue | null => {
    if (isJsonPrimitive(t) || isJsonArray(t) || isJsonObject(t)) {
      return t;
    }

    return null;
  },
);

/**
 * Returns true if input satisfies type null.
 * @param {unknown} t
 * @return {boolean}
 */
const isNull = (t: unknown): t is null => t === null;

isNull.strict = (t: unknown): asserts t is null => {
  if (!isNull(t)) {
    throw TypeError("Type guard failed. Input is not null.");
  }
};

/**
 * Returns true if input satisfies type null or undefined.
 * @param {unknown} t
 * @return {boolean}
 */
const isNil = (t: unknown): t is null | undefined =>
  isNull(t) || isUndefined(t);

isNil.strict = (
  t: unknown,
  errorMsg?: string,
): asserts t is null | undefined => {
  if (!isNil(t)) {
    throw TypeError(
      errorMsg ?? "Type guard failed. Value is not null or undefined.",
    );
  }
};

/**
 * Returns true if input is undefined, null, empty string, object with length
 * of 0 or object without enumerable keys.
 * @param {unknown} t
 * @return {boolean}
 */
const isEmpty = (
  t: unknown,
): t is null | undefined | "" | [] | Record<string, never> => {
  if (
    t === null || isUndefined(t) || (t === "") ||
    (Array.isArray(t) && (t as unknown[]).length === 0) ||
    (t && typeof t === "object" && Object.keys(t).length === 0)
  ) {
    return true;
  }

  return false;
};

isEmpty.strict = (
  t: unknown,
  errorMsg?: string,
): asserts t is null | undefined | "" | [] | Record<string, never> => {
  if (!isEmpty(t)) {
    throw TypeError(errorMsg ?? "Type guard failed. Value is not empty.");
  }
};

/**
 * Returns true if the date type is an iterator. Does not
 * check the type contained within the iterator.
 * @param t
 * @returns
 */
// deno-lint-ignore no-explicit-any
const isIterator = <C = any>(t: unknown): t is Iterator<C> =>
  typeof t === "object" &&
  !isNil(t) &&
  Symbol.iterator in t &&
  isFunction(t[Symbol.iterator]);

// deno-lint-ignore no-explicit-any
isIterator.strict = <C = any>(
  t: unknown,
  errorMsg?: string,
): asserts t is Iterator<C> => {
  if (!isIterator(t)) {
    throw TypeError(
      errorMsg ?? "Type guard failed. Value is not an interator.",
    );
  }
};

export { isEmpty, isIterator, isNil, isNull };
