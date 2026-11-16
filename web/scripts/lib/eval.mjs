const DEFAULT_TIMEOUT = 10_000;

/**
 * Run a probe expression, block or function in the page with `el` bound to
 * `locator`'s element. The source may use `await`; a returned function is
 * called with `el`; the whole evaluation is bounded by `timeout`.
 */
export async function evaluateSource(locator, source, timeout = DEFAULT_TIMEOUT) {
  return locator.evaluate(
    async (el, { source, timeout }) => {
      const withTimeout = (promise, message) =>
        Promise.race([
          promise,
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error(message)), timeout);
          })
        ]);

      const body = source.trim().startsWith("{") ? source : `return (${source});`;
      let value = new Function("el", `return (async () => { ${body} })();`)(el);
      value = await withTimeout(value, `eval timed out after ${timeout}ms`);

      if (typeof value === "function") {
        value = await withTimeout(
          value(el),
          `eval function timed out after ${timeout}ms`
        );
      }

      return value;
    },
    { source, timeout }
  );
}
