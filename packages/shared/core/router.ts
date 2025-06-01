import { RouteRegistry } from "../types/route";

export const registry: RouteRegistry = {};

/**
 * Registers a set of routes in the route registry.
 * @param routes - An object containing route definitions.
 */
export function registerRoutes(routes: RouteRegistry): void {
  Object.assign(registry, routes);
}

/**
 * Retrieves a route definition by its name.
 * @param name - The name of the route to retrieve.
 * @returns The route definition if found, otherwise undefined.
 */
export function getRoute(name: string): RouteRegistry[string] | undefined {
  return registry[name] || undefined;
}
