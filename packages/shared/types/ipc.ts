export interface IpcDefinition {
  [channel: string]: {
    req: unknown;
    res: unknown;
  };
}
