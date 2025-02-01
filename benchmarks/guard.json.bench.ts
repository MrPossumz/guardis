import { isJsonArray, isJsonObject, isJsonPrimitive } from "../src/guard.ts";

Deno.bench({
  name: "isJsonPrimitive-boolean",
  fn() {
    isJsonPrimitive(true);
  },
});

Deno.bench({
  name: "isJsonPrimitive-string",
  fn() {
    isJsonPrimitive("test");
  },
});

Deno.bench({
  name: "isJsonPrimitive-number",
  fn() {
    isJsonPrimitive(5);
  },
});

Deno.bench({
  name: "isJsonPrimitive-null",
  fn() {
    isJsonPrimitive(null);
  },
});

Deno.bench({
  name: "isJsonObject",
  fn() {
    isJsonObject({
      string: "string",
      num: 5,
      bool: true,
      null: null,
    });
  },
});

Deno.bench({
  name: "isJsonArray",
  fn() {
    isJsonArray(["a", 1, false, null]);
  },
});
