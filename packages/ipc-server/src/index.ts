import { ipcMain, WebContents } from "electron";
import type { IpcDefinition } from "@codevault/shared/index";
export * from "@codevault/shared/index";

export function registerIpcHandlers<T extends IpcDefinition>(handlers: {
  [K in keyof T]: (
    arg: T[K]["req"],
    sender: WebContents
  ) => Promise<T[K]["res"]> | T[K]["res"];
}) {
  for (const channel in handlers) {
    ipcMain.handle(channel, async (event, arg) => {
      return handlers[channel](arg, event.sender);
    });
  }
}

export function broadcast<T extends IpcDefinition, K extends keyof T>(
  channel: K,
  message: T[K]["res"],
  connections: WebContents[]
) {
  connections.forEach((conn) => conn.send(channel as string, message));
}
