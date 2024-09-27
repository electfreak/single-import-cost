import { RollupOptions } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import _commonjs from "@rollup/plugin-commonjs";
// shit, but common: https://github.com/rollup/plugins/issues/1662; TODO fix in future
const commonjs = _commonjs as unknown as typeof _commonjs.default;

import { tmpdir } from "node:os";
import { writeFileSync, existsSync, mkdtempSync } from "node:fs";
import { join, resolve } from "node:path";

function createAndGetEntryPoint(importString: string): string {
    const tempDir = mkdtempSync(join(tmpdir(), `rollup-plugin`));
    let entryPointPath = join(tempDir, "file.js");
    writeFileSync(entryPointPath, importString, "utf-8");
    return entryPointPath;
}

function getProjectRoot(filePath: string): string {
    let currPath = filePath;
    while (currPath != "/") {
        currPath = resolve(currPath, "..");
        if (existsSync(resolve(currPath, "package.json"))) {
            return currPath;
        }
    }

    throw new Error(
        `Unable to find ancestor folder with package.json for ${filePath}`
    );
}

export default function getConfig(
    filePath: string,
    importCode: string
): RollupOptions {
    console.log("project root", getProjectRoot(filePath));
    console.log(
        "module dirs",
        resolve(getProjectRoot(filePath), "node_modules")
    );
    return {
        input: createAndGetEntryPoint(importCode),
        plugins: [
            nodeResolve({
                rootDir: filePath,
                modulePaths: [
                    resolve(getProjectRoot(filePath), "node_modules"),
                ],
            }),
            commonjs({
                sourceMap: false,
            }),
        ],
        output: {
            file: "bundle.js",
            format: "cjs",
        },
    };
}
