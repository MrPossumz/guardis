import type { Parser } from "./guard.ts";

/** A record describing various types and their parsers. This can be used to generate
 * a customized Is dictionary. */
export type ParserRecords = Record<string, Parser>;

/** Any valid primitive json value. */
export type JsonPrimitive = string | number | boolean | null;

/** An array of JSON-able values. */
export type JsonArray = JsonValue[] | readonly JsonValue[];

/** An object containing only JSON-able values. */
export type JsonObject =
  & { [Key in string]: JsonValue }
  & { [Key in string]?: JsonValue | undefined };

/** The complete set of JSON-able data types. */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/** Construct a tuple of unknowns, up to size 10. */
export type TupleOfLength<N extends number> = N extends 0 ? []
  : N extends 1 ? [unknown]
  : N extends 2 ? [unknown, unknown]
  : N extends 3 ? [unknown, unknown, unknown]
  : N extends 4 ? [unknown, unknown, unknown, unknown]
  : N extends 5 ? [unknown, unknown, unknown, unknown, unknown]
  : N extends 6 ? [unknown, unknown, unknown, unknown, unknown, unknown]
  : N extends 7 ? [unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  : N extends 8 ? [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  : N extends 9 ? [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  : unknown[];

/** Replace the type at position X in tuple T with type R */
export type ReplaceTupleIndex<T extends readonly unknown[], X extends number, R> = {
  readonly [K in keyof T]: K extends `${X}` ? R : T[K];
};
