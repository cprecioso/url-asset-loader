import template from "@babel/template";
import type { NodePath } from "@babel/traverse";
import type { NewExpression } from "@babel/types";
import assert from "assert";
import type { loader } from "webpack";
import { RAW_REQUIRE } from "./index";
import { isImportMetaUrl } from "./util";

const transformUrlConstructor = (
  { target }: loader.LoaderContext,
  path: NodePath<NewExpression>,
  filePath: string
) => {
  const { scope } = path;
  const program = path.findParent((path) => path.isProgram());
  assert(program.isProgram());
  const programScope = program.scope;

  const importIdentifier = scope.generateUidIdentifier(filePath);

  if (target === "node") {
    const urlModuleIdentifier = programScope.generateUidIdentifier("node:url");
    const pathModuleIdentifier =
      programScope.generateUidIdentifier("node:path");

    program.node.body.unshift(
      ...template.statements.ast`
        import ${urlModuleIdentifier} from "url";
        import ${pathModuleIdentifier} from "path";
      `
    );

    path.replaceWith(
      template.expression.ast`
        new URL(
          ${urlModuleIdentifier}.pathToFileURL(
            ${RAW_REQUIRE}.resolve(
              "." +
                ${pathModuleIdentifier}.sep +
                ${pathModuleIdentifier}.normalize(${importIdentifier})
            )
          )
        )
      `
    );
  } else {
    path.replaceWith(
      template.expression.ast`
        new URL(
          ${importIdentifier},
          (document.currentScript && document.currentScript.src)
          || document.baseURI
        )
      `
    );
  }

  program.node.body.unshift(
    template.statement.ast`
      import ${importIdentifier} from "${filePath}"
    `
  );
};

export const transformNewExpression =
  (ctx: loader.LoaderContext) => (path: NodePath<NewExpression>) => {
    const callee = path.get("callee");
    const [filePathArg, importMetaUrlArg] = path.get("arguments");

    if (
      callee.isIdentifier({ name: "URL" }) &&
      filePathArg &&
      filePathArg.isStringLiteral() &&
      importMetaUrlArg &&
      isImportMetaUrl(importMetaUrlArg)
    ) {
      transformUrlConstructor(ctx, path, filePathArg.node.value);
    }
  };
