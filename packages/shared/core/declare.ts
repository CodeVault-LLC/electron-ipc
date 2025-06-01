import type { RouteDefinition } from "../types/route";

/**
 * Declares a set of routes with their definitions.
 * @param defs - An object containing route definitions.
 * @returns The same object for chaining or further use.
 */
export function declareRoutes(
  defs: Record<string, RouteDefinition>
): Record<string, RouteDefinition> {
  return defs;
}
