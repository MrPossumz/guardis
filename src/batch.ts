import type { ParserRecords } from "./types.ts";
import { createTypeGuard } from "./guard.ts";
import { toPascalCase } from "jsr:@std/text/to-pascal-case";

type GuardRecords<E extends ParserRecords, K extends keyof E = keyof E> = {
  [key in K as `is${Capitalize<key & string>}`]: ReturnType<
    typeof createTypeGuard<Exclude<ReturnType<E[key]>, null>>
  >;
};

/**
 * Batch generate a set of type guard functions. The returned record
 * will contain keys for each type, prefixed by `is`. These can be destructured
 * to the corresponding type guards.
 *
 * @param config
 * @returns
 *
 * Keys will be automatically capitalized in the returned object.
 * _e.g._
 * * `Meatball => isMeatball`
 * * `sausage => isSausage`
 *
 * @example
 * const { isMeatball } = batch({ Meatball: (v) => v === "meatball" ? v : null });
 */
export function batch<B extends ParserRecords>(config: B): GuardRecords<B> {
  const entries = Object.entries(config)
    .map((
      [name, parser],
    ) => [`is${toPascalCase(name)}`, createTypeGuard(parser)]);

  return Object.fromEntries(entries);
}
