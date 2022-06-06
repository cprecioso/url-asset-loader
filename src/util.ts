import type { NodePath } from "@babel/traverse";

const isImportMeta = (path: NodePath) =>
  path.isMetaProperty() &&
  path.get("meta").isIdentifier({ name: "import" }) &&
  path.get("property").isIdentifier({ name: "meta" });

export const isImportMetaUrl = (path: NodePath) =>
  path.isMemberExpression() &&
  isImportMeta(path.get("object")) &&
  path.get("property").isIdentifier({ name: "url" });
