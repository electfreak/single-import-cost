import { rollup, RollupBuild, RollupOptions } from "rollup";

import _terser from "@rollup/plugin-terser";
import _commonjs from "@rollup/plugin-commonjs";
// shit, but common: https://github.com/rollup/plugins/issues/1662; TODO fix in future
const terser = _terser as unknown as typeof _terser.default;
const commonjs = _commonjs as unknown as typeof _commonjs.default;

import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { mkdtemp } from "node:fs/promises";
import { createAndGetEntryPoint, getPeerDeps, getProjectRoot } from "./util.js";
import { nodeResolve } from "@rollup/plugin-node-resolve";

import type { Bundler } from "./api/Bundler.ts";
import type { ImportData } from "./api/Import.ts";

export class RollupBundler implements Bundler {
    static getConfig(importData: ImportData): RollupOptions {
        const { filePath, importString } = importData;
        return {
            input: createAndGetEntryPoint(importString),
            treeshake: true,
            external: getPeerDeps(importData),
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
        };
    }

    static async bundle(importData: ImportData): Promise<string> {
        const tempDirPrefix = `rollup-plugin-${Date.now()}`;
        const tempDir = await mkdtemp(join(tmpdir(), tempDirPrefix));
        const bundlePath = resolve(tempDir, "bundle.js");
        const bundle = await rollup(RollupBundler.getConfig(importData));
        const { output } = await bundle.write({
            format: "es",
            file: bundlePath,
            plugins: [
                terser({
                    maxWorkers: 1,
                }),
            ],
        });
        await bundle.close();
        return bundlePath;
    }
}
