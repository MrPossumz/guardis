import { assert, assertFalse, assertThrows } from "@std/assert";
import { extend } from "./extend.ts";
import { createTypeGuard } from "./guard.ts";

Deno.test("extend", async (t) => {
  await t.step("basic", () => {
    const Is = extend({
      MySillyType: (v: unknown) => {
        if (v === 10 || v === "meatball") {
          return v;
        }

        return null;
      },
    });

    assert("MySillyType" in Is);
    assert(Is.MySillyType(10));
    assert(Is.MySillyType("meatball"));
    assertFalse(Is.MySillyType(1));

    assert("strict" in Is.MySillyType);
    Is.MySillyType.strict(10);
    assertThrows(() => Is.MySillyType.strict("sausage"));
  });

  await t.step("iteration", () => {
    const Is = extend({
      Meatball: (v: unknown) => v === "meatball" ? v : null,
    });

    assert("Meatball" in Is);
    assert(Is.Meatball("meatball"));
    assertFalse(Is.Meatball(1));

    assertFalse("Sauage" in Is);

    const IsTwo = extend(Is, {
      Sausage: (v: unknown) => v === "sausage" ? v : null,
    });

    assert("Sausage" in IsTwo);
    assert(IsTwo.Sausage("sausage"));
    assertFalse(IsTwo.Sausage(1));

    assert("Meatball" in IsTwo);
    assert(IsTwo.Meatball("meatball"));
    assertFalse(IsTwo.Meatball(1));

    assertFalse("Sauage" in Is);
  });
});
