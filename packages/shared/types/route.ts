export interface RouteDefinition<Req = any, Res = unknown> {
  handler: (args: Req) => Promise<Res> | AsyncIterable<Res>;
  isStream?: boolean;
}

export type RouteRegistry = Record<string, RouteDefinition>;
