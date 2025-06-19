import { SourceFile, Type } from "ts-morph";

export function getCleanTypeText(type: Type, sourceFile: SourceFile): string {
  const apparent = type.getApparentType();
  const text = apparent.getText(sourceFile);

  if (text === "Number") return "number";
  if (text === "String") return "string";
  if (text === "Boolean") return "boolean";

  return text;
}
