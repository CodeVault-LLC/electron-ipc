import { contextBridge, ipcRenderer } from "electron";
import type { IpcDefinition } from "@codevault/shared/index";
export * from "@codevault/shared/index";

export function createRendererIpc<T extends IpcDefinition>() {
  return {
    send: async <K extends keyof T>(
      channel: K,
      arg: T[K]["req"]
    ): Promise<T[K]["res"]> => {
      return ipcRenderer.invoke(channel as string, arg);
    },
    subscribe: <K extends keyof T>(
      channel: K,
      listener: (data: T[K]["res"]) => void
    ) => {
      ipcRenderer.on(channel as string, (_, data) => listener(data));
      ipcRenderer.send(channel as string);
    },
  };
}

export function exposeApi<T extends IpcDefinition>(
  api: ReturnType<typeof createRendererIpc<T>>
) {
  contextBridge.exposeInMainWorld("api", api);
}
