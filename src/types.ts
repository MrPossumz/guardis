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
