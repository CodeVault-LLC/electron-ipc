import { RouteDef } from "./types";
import { extractRoutes } from "./parser";
import fs from "node:fs";

function writeIPCDefinition(routes: Record<string, RouteDef>, outPath: string) {
  const builder: string[] = [];

  builder.push(
    `import { callRoute as baseCallRoute } from '@codevault/electron-ipc'\n`
  );

  builder.push(`export type IpcDefinition = {`);
  for (const [name, def] of Object.entries(routes)) {
    builder.push(`  "${name}": {`);
    builder.push(`    req: ${def.req};`);
    builder.push(`    res: ${def.res};`);
    builder.push(`  };`);
  }
  builder.push(`}\n`);

  builder.push(`
export function callRoute<K extends keyof IpcDefinition>(
  route: K,
  args: IpcDefinition[K]['req']
): Promise<IpcDefinition[K]['res']> {
  return baseCallRoute(route, args);
}
  `);

  fs.writeFileSync(outPath, builder.join("\n"), "utf8");
}

// CLI entry
const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error("Usage: ts-node codegen.ts <inputFile.ts> <outputFile.ts>");
  process.exit(1);
}

const routes = extractRoutes(inputFile);
writeIPCDefinition(routes, outputFile);
