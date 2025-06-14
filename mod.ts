/**
 * Guardis is a utility to help build type guard libraries while
 * addressing one of the main flaws in TypeScript's "type guard"
 * behavior.
 *
 * @module Guardis
 * @author MrPossumz
 */

export * from "./src/guard.ts";
export * from "./src/extend.ts";
export * from "./src/batch.ts";
export * from "./src/types.ts";

import type { TypeGuard } from "./src/guard.ts";
import * as g from "./src/guard.ts";
import type {
  JsonArray,
  JsonObject,
  JsonPrimitive,
  JsonValue,
  TupleOfLength,
} from "./src/types.ts";

/**
 * "Is" serves as the main libray object and contains
 * keys corresponding to most of JavaScript's basic
 * data types. The key values are callbacks that function as
 * type guards for their respective types.
 */
export const Is: {
  Boolean: TypeGuard<boolean>;
  String: TypeGuard<string>;
  Number: TypeGuard<number>;
  Binary: TypeGuard<0 | 1>;
  Numeric: TypeGuard<number>;
  Function: TypeGuard<Function>;
  Object: TypeGuard<object>;
  Undefined: TypeGuard<undefined>;
  Array: TypeGuard<Array<unknown>>;
  JsonPrimitive: TypeGuard<boolean | string | number | null>;
  JsonArray: TypeGuard<JsonArray>;
  JsonObject: TypeGuard<Record<string, JsonValue>>;
  JsonValue: TypeGuard<JsonPrimitive | JsonArray | JsonObject>;
  Null: {
    (value: unknown): value is null;
    strict: (
      value: unknown,
      errorMsg?: string,
    ) => value is null;
  };
  Nil: {
    (value: unknown): value is null | undefined;
    strict: (
      value: unknown,
      errorMsg?: string,
    ) => value is null | undefined;
  };
  Empty: {
    (
      value: unknown,
    ): value is null | undefined | "" | [] | Record<string, never>;
    strict: (
      value: unknown,
      errorMsg?: string,
    ) => value is null | undefined | "" | [] | Record<string, never>;
  };
  Tuple: {
    <N extends number>(value: unknown, length: N): value is TupleOfLength<N>;
    strict<N extends number>(
      value: unknown,
      length: N,
    ): value is TupleOfLength<N>;
  };
} = {
  Boolean: g.isBoolean,
  String: g.isString,
  Number: g.isNumber,
  Binary: g.isBinary,
  Numeric: g.isNumeric,
  Function: g.isFunction,
  Object: g.isObject,
  Undefined: g.isUndefined,
  Array: g.isArray,
  JsonPrimitive: g.isJsonPrimitive,
  JsonArray: g.isJsonArray,
  JsonObject: g.isJsonObject,
  JsonValue: g.isJsonValue,
  Null: g.isNull,
  Nil: g.isNil,
  Empty: g.isEmpty,
  Tuple: g.isTuple,
} as const;
