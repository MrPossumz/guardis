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

import * as g from "./src/guard.ts";

/**
 * "Is" serves as the main libray object and contains
 * keys corresponding to most of JavaScript's basic
 * data types. The key values are callbacks that function as
 * type guards for their respective types.
 */
export const Is = {
  Boolean: g.isBoolean,
  String: g.isString,
  Number: g.isNumber,
  Binary: g.isBinary,
  Numeric: g.isNumeric,
  Function: g.isFunction,
  Object: g.isObject,
  Undefined: g.isUndefined,
  JsonPrimitive: g.isJsonPrimitive,
  JsonArray: g.isJsonArray,
  JsonObject: g.isJsonObject,
  JsonValue: g.isJsonValue,
  Null: g.isNull,
  Nil: g.isNil,
  Empty: g.isEmpty,
} as const;
