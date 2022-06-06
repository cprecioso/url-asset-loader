// @ts-check

import { parseAsync } from "@babel/core";
import generate from "@babel/generator";
import traverse from "@babel/traverse";
import assert from "assert";
import type { loader } from "webpack";
import { transformNewExpression } from "./transform";

export const RAW_REQUIRE = "__non_webpack_require__";

const loaderFn = async (
  ctx: loader.LoaderContext,
  source: string | Buffer,
  sourceMap?: any
) => {
  assert(ctx.target === "web" || ctx.target === "node");
  assert(typeof source === "string");

  const ast = await parseAsync(source, { inputSourceMap: sourceMap });

  traverse(ast, {
    NewExpression: transformNewExpression(ctx),
  });

  return generate(ast, { sourceMaps: true });
};

const urlAssetLoader: loader.Loader = function (source, sourceMap) {
  const callback = this.async();

  loaderFn(this, source, sourceMap).then(
    (result) => callback(null, result.code, result.map as any),
    (error) => callback(error)
  );
};

export default urlAssetLoader;
