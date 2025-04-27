import { createTypeGuard, type TypeGuard } from "../guard.ts";

/**
 * Returns true if input is an instance of the native URL
 * class.
 * @param {unknown} t
 * @return {boolean}
 */
export const isNativeURL: TypeGuard<URL> = createTypeGuard((t: unknown) => {
  return t instanceof URL ? t : null;
});

/**
 * Returns true if input is an instance of the native Request
 * class.
 * @param {unknown} t
 * @return {boolean}
 */
export const isRequest: TypeGuard<Request> = createTypeGuard((t: unknown) => {
  return t instanceof Request ? t : null;
});

/**
 * Returns true if input is an instance of the native Response
 * class.
 * @param {unknown} t
 * @return {boolean}
 */
export const isResponse: TypeGuard<Response> = createTypeGuard((t: unknown) => {
  return t instanceof Response ? t : null;
});
