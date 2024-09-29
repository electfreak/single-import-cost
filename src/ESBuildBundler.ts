import { build, BuildOptions } from "esbuild";
import {
    createAndGetEntryPoint,
    getProjectRoot,
    getPeerDeps,
    getPackageNodeModulesDir,
    tempDir,
} from "./util.js";
import { resolve } from "node:path";
import { builtinModules } from "node:module";
import type { Bundler, ImportData } from "./api/types.ts";

export class ESBuildBundler implements Bundler {
    static getConfig(importData: ImportData) {
        const entryPoint = createAndGetEntryPoint(importData.importString);
        const projectRoot = getProjectRoot(importData.filePath);

        return {
            entryPoints: [entryPoint],
            bundle: true,
            nodePaths: [
                resolve(projectRoot, "node_modules"),
                getPackageNodeModulesDir(importData),
            ],
            outfile: resolve(tempDir, "esbuild/bundle.js"),
            minify: true,
            sourcemap: false,
            treeShaking: true,
            external: [...builtinModules, ...getPeerDeps(importData)],
        };
    }

    static async bundle(importData: ImportData): Promise<string> {
        const config = ESBuildBundler.getConfig(importData);
        const result = await build(config);
        return config.outfile;
    }
}
