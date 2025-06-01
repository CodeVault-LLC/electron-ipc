import { callRoute as baseCallRoute } from '@codevault/electron-ipc'

export type IpcDefinition = {
  'system:logs': {
    req: unknown
    res: AsyncIterable<unknown>
  }
  'user:get': {
    req: {
      id: string
    }
    res: unknown
  }
}

export function callRoute<K extends keyof IpcDefinition>(
  route: K,
  args: IpcDefinition[K]['req']
): Promise<IpcDefinition[K]['res']> {
  return baseCallRoute(route, args)
}
