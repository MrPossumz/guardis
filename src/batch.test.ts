import { assert, assertFalse, assertThrows } from "@std/assert";
import { batch } from "./batch.ts";

Deno.test("batch", () => {
  const { isMeatball, isSausage, isSpaghetti } = batch({
    Meatball: (v) => v === "meatball" ? v : null,
    Sausage: (v) => v === "sausage" ? v : null,
    spaghetti: (v) => v === "spaghetti" ? v : null,
  });

  assert(isMeatball);
  assert(isMeatball("meatball"));
  assertFalse(isMeatball("sausage"));
  assert("strict" in isMeatball);
  assertThrows(() => isMeatball.strict("sausage"));

  assert(isSausage);
  assert(isSausage("sausage"));
  assertFalse(isSausage("spaghetti"));
  assert("strict" in isSausage);
  assertThrows(() => isSausage.strict("spaghetti"));

  assert(isSpaghetti);
  assert(isSpaghetti("spaghetti"));
  assertFalse(isSpaghetti("meatball"));
  assert("strict" in isSpaghetti);
  assertThrows(() => isSpaghetti.strict("meatball"));
});
