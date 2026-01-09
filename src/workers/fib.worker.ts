// Pre-compiled Rust WASM binary (fib function)
const WASM_BASE64 =
  "AGFzbQEAAAABBgFgAX8BfwMCAQAEBQFwAQEBBQMBABAGGQN/AUGAgMAAC38AQYCAwAALfwBBgIDAAAsHKwQGbWVtb3J5AgADZmliAAAKX19kYXRhX2VuZAMBC19faGVhcF9iYXNlAwIKRgFEAQN/AkAgAEECTg0AIABBAGoPC0EAIQEDQCAAQX9qEICAgIAAIAFqIQEgAEEDSyECIABBfmoiAyEAIAINAAsgAyABagsAMQRuYW1lAA4Nd2FzbV9saWIud2FzbQEGAQADZmliBxIBAA9fX3N0YWNrX3BvaW50ZXIATQlwcm9kdWNlcnMCCGxhbmd1YWdlAQRSdXN0AAxwcm9jZXNzZWQtYnkBBXJ1c3RjHTEuODEuMCAoZWViOTBjZGExIDIwMjQtMDktMDQpACwPdGFyZ2V0X2ZlYXR1cmVzAisPbXV0YWJsZS1nbG9iYWxzKwhzaWduLWV4dA==";

const fibJs = (n: number): number => {
  if (n <= 1) return n;
  return fibJs(n - 1) + fibJs(n - 2);
};

let wasmInstance: WebAssembly.Instance | null = null;

const initWasm = async () => {
  if (wasmInstance) return;

  try {
    const binaryString = self.atob(WASM_BASE64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const { instance } = await WebAssembly.instantiate(bytes);
    wasmInstance = instance;
    self.postMessage({ type: "WASM_LOADED" });
  } catch (err) {
    console.error("Failed to load WASM in worker:", err);
    self.postMessage({ type: "ERROR", payload: "Failed to load WASM" });
  }
};

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === "INIT") {
    await initWasm();
  } else if (type === "RUN_JS") {
    const n = payload as number;
    const jsStart = performance.now();
    const jsResult = fibJs(n);
    const jsEnd = performance.now();
    const jsTime = jsEnd - jsStart;

    self.postMessage({
      type: "JS_RESULT",
      payload: { time: jsTime, result: jsResult },
    });
  } else if (type === "RUN_WASM") {
    const n = payload as number;

    if (!wasmInstance) {
      await initWasm();
    }

    if (wasmInstance) {
      const wasmStart = performance.now();
      const wasmExports = wasmInstance.exports as unknown as { fib: (input: number) => number };
      const wasmResult = wasmExports.fib(n);
      const wasmEnd = performance.now();
      const wasmTime = wasmEnd - wasmStart;

      self.postMessage({
        type: "WASM_RESULT",
        payload: { time: wasmTime, result: wasmResult },
      });
    } else {
      self.postMessage({ type: "ERROR", payload: "WASM instance not ready" });
    }
  }
};
