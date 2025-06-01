package parser

import (
	"fmt"
	"os"
	"strings"

	"github.com/armsnyder/typescript-ast-go/ast"
	"github.com/armsnyder/typescript-ast-go/parser"
)

type RouteDef struct {
	Req string
	Res string
}

// ParseTypeScriptFile parses a TypeScript file and extracts route definitions
func ParseTypeScriptFile(filename string) (map[string]RouteDef, error) {
	content, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	sourceFile := parser.Parse(content)
	routes := make(map[string]RouteDef)

	ast.Inspect(sourceFile, func(n ast.Node) bool {
		// Look for call expressions
		if callExpr, ok := n.(*ast.CallExpression); ok {
			// Check if the callee is 'declareRoutes'
			if ident, ok := callExpr.Callee.(*ast.Identifier); ok && ident.Name == "declareRoutes" {
				// Process the arguments of declareRoutes
				if len(callExpr.Arguments) > 0 {
					if objLit, ok := callExpr.Arguments[0].(*ast.ObjectLiteral); ok {
						for _, prop := range objLit.Properties {
							if propAssign, ok := prop.(*ast.PropertyAssignment); ok {
								routeName := ""
								if ident, ok := propAssign.Name.(*ast.Identifier); ok {
									routeName = ident.Name
								} else if strLit, ok := propAssign.Name.(*ast.StringLiteral); ok {
									routeName = strLit.Value
								}

								if routeName != "" {
									// Initialize default types
									reqType := "unknown"
									resType := "unknown"

									// Check if the initializer is an object literal
									if innerObjLit, ok := propAssign.Initializer.(*ast.ObjectLiteral); ok {
										for _, innerProp := range innerObjLit.Properties {
											if innerPropAssign, ok := innerProp.(*ast.PropertyAssignment); ok {
												if innerPropAssign.Name.String() == "handler" {
													// Extract function information
													switch fn := innerPropAssign.Initializer.(type) {
													case *ast.FunctionExpression:
														// Extract parameter type
														if len(fn.Parameters) > 0 {
															param := fn.Parameters[0]
															if param.Type != nil {
																reqType = param.Type.String()
															}
														}
														// Extract return type
														if fn.Type != nil {
															resType = fn.Type.String()
														}
													case *ast.ArrowFunction:
														// Extract parameter type
														if len(fn.Parameters) > 0 {
															param := fn.Parameters[0]
															if param.Type != nil {
																reqType = param.Type.String()
															}
														}
														// Extract return type
														if fn.Type != nil {
															resType = fn.Type.String()
														}
													}
												}
											}
										}
									}

									routes[routeName] = RouteDef{
										Req: reqType,
										Res: resType,
									}
								}
							}
						}
					}
				}
			}
		}
		return true
	})

	return routes, nil
}

func WriteIPCDefinition(path string, routes map[string]RouteDef) error {
	builder := strings.Builder{}

	// Add import
	builder.WriteString("import { callRoute as baseCallRoute } from '@codevault/electron-ipc';\n\n")

	// Start IpcDefinition type
	builder.WriteString("export type IpcDefinition = {\n")
	for name, def := range routes {
		builder.WriteString(fmt.Sprintf("  \"%s\": {\n", name))
		builder.WriteString(fmt.Sprintf("    req: %s,\n", def.Req))
		builder.WriteString(fmt.Sprintf("    res: %s\n", def.Res))
		builder.WriteString("  },\n")
	}
	builder.WriteString("}\n\n")

	// Add callRoute helper function
	builder.WriteString(`export function callRoute<K extends keyof IpcDefinition>(
  route: K,
  args: IpcDefinition[K]['req']
): Promise<IpcDefinition[K]['res']> {
  return baseCallRoute(route, args);
}
`)

	return os.WriteFile(path, []byte(builder.String()), 0644)
}
