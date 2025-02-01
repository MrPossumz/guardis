import {
isArray,
  isBinary,
  isBoolean,
  isEmpty,
  isFunction,
  isNull,
  isNumber,
  isNumeric,
  isObject,
  isString,
  isUndefined,
} from "../src/guard.ts";

Deno.bench({
  name: "isBoolean",
  fn() {
    isBoolean(true);
  },
});

Deno.bench({
  name: "isString",
  fn() {
    isString("a");
  },
});

Deno.bench({
  name: "isNumber",
  fn() {
    isNumber(3);
  },
});

Deno.bench({
  name: "isBinary",
  fn() {
    isBinary(true);
  },
});

Deno.bench({
  name: "isNumeric",
  fn() {
    isNumeric("4");
  },
});

Deno.bench({
  name: "isFunction",
  fn() {
    isFunction(() => {});
  },
});

Deno.bench({
  name: "isUndefined",
  fn() {
    isUndefined(undefined);
  },
});

Deno.bench({
  name: "isObject",
  fn() {
    isObject({});
  },
});

Deno.bench({
	name: "isArray",
	fn() {
		isArray([]);
	}
})

Deno.bench({
  name: "isNull",
  fn() {
    isNull(null);
  },
});

Deno.bench({
  name: "isNil",
  fn() {
    isNull(undefined);
  },
});

Deno.bench({
  name: "isEmpty",
  fn() {
    isEmpty({});
  },
});


// Deno.bench({
//   name: "example async test",
//   async fn() {
//     const decoder = new TextDecoder("utf-8");
//     const data = await Deno.readFile("hello_world.txt");
//     assertEquals(decoder.decode(data), "Hello world");
//   },
// });
