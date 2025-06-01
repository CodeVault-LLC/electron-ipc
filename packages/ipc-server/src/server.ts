import { getRoute } from "@codevault/shared/core/router";
import { ipcMain } from "electron";

export function initializeIpcMain() {
  ipcMain.handle("__super_ipc_call__", async (event, { route, args }) => {
    const def = getRoute(route);
    if (!def) throw new Error(`No route found: ${route}`);

    if (def.isStream) {
      const streamId = `__super_ipc_stream__:${route}`;
      const iterator = await def.handler(args);

      for await (const value of iterator as AsyncIterable<any>) {
        event.sender.send(streamId, value);
      }

      return null; // signals end
    }

    return def.handler(args);
  });
}

export { registerRoutes } from "@codevault/shared/core/router";
export { RouteDefinition } from "@codevault/shared/types/route";
export type { RouteRegistry } from "@codevault/shared/types/route";
export { declareRoutes } from "@codevault/shared/core/declare";
