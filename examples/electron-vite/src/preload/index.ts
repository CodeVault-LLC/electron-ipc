import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { createRendererIpc, exposeApi } from '@codevault/electron-ipc'
import { Channels } from '../main'

// Custom APIs for renderer
const api = createRendererIpc<Channels>()

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = exposeApi(api)
}
