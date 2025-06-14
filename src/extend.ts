import type { ParserRecords } from "./types.ts";
import { createTypeGuard } from "./guard.ts";
import { Is } from "../mod.ts";

/** The return Is dictionary, merging both the definitions from the standard library
 * and the custom type guards generated from the GuardExtension record. */
export type ExtendedIs<E extends ParserRecords, I extends typeof Is> = {
  [K in keyof I | keyof E]: K extends keyof I ? I[K] : K extends keyof E ? ReturnType<
    typeof createTypeGuard<Exclude<ReturnType<E[K]>, null>>
  > : never;
};

/**
 * Generate a custom Is dictionary using an object with the names of your types
 * and the parsers to use to create type guards.
 * @param config
 * @returns
 */
export function extend<P extends ParserRecords>(
  config: P,
): ExtendedIs<P, typeof Is>;
/**
 * Clones the provided Is library and extends it by adding in your
 * new parsers.
 * @param Is The Is library to extend.
 * @param config The catalog of parsers to include in your library.
 * @returns
 */
export function extend<P extends ParserRecords, I extends typeof Is>(
  is: I,
  config: P,
): ExtendedIs<P, I>;
export function extend<P extends ParserRecords, I extends typeof Is>(
  ...args: [P] | [P, I]
): ExtendedIs<P, I> {
  const config = (1 in args ? args[1] : args[0]) as P;
  const is = 1 in args ? args[0] : Is;

  const entries = Object.entries(config)
    .map(([name, parser]) => [name, createTypeGuard(parser)]);

  return { ...Object.fromEntries(entries), ...(is ?? Is) };
}
