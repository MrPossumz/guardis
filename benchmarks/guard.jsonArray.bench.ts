import { isJsonArray } from "../src/guard.ts";

Deno.bench({
  name: "primitives",
  fn() {
    isJsonArray(["a", 1, false, null]);
  },
});

Deno.bench({
  name: "primitives + arrays",
  fn() {
    isJsonArray(["a", 1, false, null, ["b", 2, true, null]]);
  },
});

Deno.bench({
  name: "primitives + objects",
  fn() {
    isJsonArray(["a", 1, false, null, { a: "a", b: 2, c: true, d: null }]);
  },
});

Deno.bench({
  name: "primitives + objects + arrays",
  fn() {
    isJsonArray(
      ["a", 1, false, null, { a: "a", b: 2, c: true, d: null }, [
        "b",
        2,
        true,
        null,
      ]],
    );
  },
});

Deno.bench({
  name: "nested primitives + objects + arrays",
  fn() {
    isJsonArray(
      ["a", 1, false, null, {
        a: "a",
        b: 2,
        c: true,
        d: null,
        e: [
          "b",
          2,
          true,
          null,
        ],
      }],
    );
  },
});
