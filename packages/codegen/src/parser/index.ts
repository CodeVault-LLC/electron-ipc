import { Project, SyntaxKind } from "ts-morph";
import { RouteDef } from "../types";
import { getCleanTypeText } from "../lib/clean-type";

export const extractRoutes = (filePath: string): Record<string, RouteDef> => {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
  });

  const sourceFile = project.addSourceFileAtPath(filePath);
  const routes: Record<string, RouteDef> = {};

  sourceFile.forEachDescendant((node) => {
    if (
      node.getKind() === SyntaxKind.CallExpression &&
      node.getFirstChildByKind(SyntaxKind.Identifier)?.getText() ===
        "declareRoutes"
    ) {
      const callExpr = node.asKind(SyntaxKind.CallExpression);
      if (!callExpr) return;
      const arg = callExpr.getArguments()[0];

      if (
        !arg ||
        !arg.compilerNode ||
        arg.getKind() !== SyntaxKind.ObjectLiteralExpression
      )
        return;

      arg.forEachChild((child) => {
        if (child.getKind() !== SyntaxKind.PropertyAssignment) return;

        const prop = child.asKindOrThrow(SyntaxKind.PropertyAssignment);
        const routeName = prop.getName().replace(/['"]/g, "");

        const handlerObj = prop.getInitializerIfKind(
          SyntaxKind.ObjectLiteralExpression
        );
        if (!handlerObj) return;

        let req = "unknown";
        let res = "unknown";
        let isStream = false;

        handlerObj.getProperties().forEach((p) => {
          if (!p.isKind(SyntaxKind.PropertyAssignment)) return;
          const name = p.getName();

          if (name === "handler") {
            const fn =
              p.getInitializerIfKind(SyntaxKind.FunctionExpression) ??
              p.getInitializerIfKind(SyntaxKind.ArrowFunction);

            if (!fn) return;

            const checker = project.getTypeChecker();
            const param = fn.getParameters()[0];
            const returnType = fn.getReturnType();

            if (param) {
              const paramType = param.getType();

              if (
                paramType.isClassOrInterface() ||
                paramType.isUnion() ||
                paramType.isIntersection()
              ) {
                req = getCleanTypeText(paramType, sourceFile);
              }

              req = getCleanTypeText(paramType, sourceFile);
            }
            // Unwrap Promise<T> or AsyncGenerator<T> manually
            const resBaseType = (() => {
              const symbolName = returnType.getSymbol()?.getName();

              if (symbolName === "Promise") {
                const [inner] = returnType.getTypeArguments();
                return inner ? getCleanTypeText(inner, sourceFile) : "unknown";
              }

              if (
                symbolName === "AsyncGenerator" ||
                symbolName === "AsyncIterableIterator"
              ) {
                const [inner] = returnType.getTypeArguments();
                return inner ? getCleanTypeText(inner, sourceFile) : "unknown";
              }

              return getCleanTypeText(returnType, sourceFile);
            })();

            res = isStream ? `AsyncIterable<${resBaseType}>` : resBaseType;
          }

          if (name === "isStream") {
            const val = p.getInitializerIfKind(SyntaxKind.TrueKeyword);
            isStream = !!val;
          }
        });

        routes[routeName] = {
          req,
          res: isStream ? `AsyncIterable<${res}>` : res,
          isStream,
        };
      });
    }
  });

  return routes;
};
