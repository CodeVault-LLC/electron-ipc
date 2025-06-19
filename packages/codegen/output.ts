import { callRoute as baseCallRoute } from '@codevault/electron-ipc'

export type IpcDefinition = {
  "user:get": {
    req: UserArguments;
    res: { id: string; name: string; };
  };
  "user:all": {
    req: number;
    res: { id: string; name: string; }[];
  };
  "system:logs": {
    req: { count: number; };
    res: AsyncIterable<string>;
  };
}


export function callRoute<K extends keyof IpcDefinition>(
  route: K,
  args: IpcDefinition[K]['req']
): Promise<IpcDefinition[K]['res']> {
  return baseCallRoute(route, args);
}
  