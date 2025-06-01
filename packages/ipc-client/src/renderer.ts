import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export function callRoute(
  route: string,
  args: Record<string, any>
): Promise<any> {
  return window.electron.ipcRenderer.invoke("__super_ipc_call__", {
    route,
    args,
  });
}

export function streamRoute(
  route: string,
  args: Record<string, any>,
  onData: (chunk: any) => void
): void {
  const channel = `__super_ipc_stream__:${route}`;

  window.electron.ipcRenderer.on(channel, (_, chunk) => {
    onData(chunk);
  });

  window.electron.ipcRenderer.invoke("__super_ipc_call__", { route, args });
}
