import { ElectronAPI } from '@electron-toolkit/preload'
import { createRendererIpc } from '@codevault/electron-ipc'

declare global {
  interface Window {
    electron: ElectronAPI
    api: ReturnType<typeof createRendererIpc>
  }
}
