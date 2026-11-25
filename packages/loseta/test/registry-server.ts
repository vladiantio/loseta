import { createServer } from "node:http";
import type { Server } from "node:http";
import { LocalRegistrySource } from "../src/local-registry.js";
import { serializePayload } from "../src/payload.js";
import { registryDir } from "../src/registry.js";

export interface TestRegistryServer {
  url: string;
  close(): Promise<void>;
}

function send(
  response: import("node:http").ServerResponse,
  status: number,
  body: string
): void {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(body);
}

/**
 * Serves the authored registry as static JSON. The payload bytes use the same
 * canonical serialization the generator uses, so catalog hashes verify.
 */
export async function startTestRegistry(
  sourceDir: string = registryDir
): Promise<TestRegistryServer> {
  const source = new LocalRegistrySource(sourceDir);
  const catalog = await source.catalog();

  const server: Server = createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    const parts = url.pathname.split("/").filter(Boolean);

    try {
      if (url.pathname === "/registry.json") {
        send(response, 200, serializePayload(catalog));
        return;
      }

      if (parts[0] === "styles" && parts.length === 3) {
        const style = parts[1] ?? "";
        const name = (parts[2] ?? "").replace(/\.json$/, "");
        const item = await source.item(name, style);
        send(response, 200, serializePayload(item.item));
        return;
      }

      if (parts[0] === "foundation" && parts.length === 2) {
        const name = (parts[1] ?? "").replace(/\.json$/, "");
        const item = await source.item(name, "nova");
        send(response, 200, serializePayload(item.item));
        return;
      }

      if (parts[0] === "external" && parts.length === 2) {
        const name = (parts[1] ?? "").replace(/\.json$/, "");
        const item = await source.item(name, "nova");
        send(response, 200, serializePayload(item.item));
        return;
      }

      send(response, 404, JSON.stringify({ error: "not found" }));
    } catch (error) {
      send(response, 500, JSON.stringify({ error: (error as Error).message }));
    }
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not start the test registry server");
  }

  return {
    url: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.closeAllConnections();
        server.close((error) => (error ? reject(error) : resolve()));
      })
  };
}
