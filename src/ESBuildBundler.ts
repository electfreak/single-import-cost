import { build } from "esbuild";
import {
    createAndGetEntryPoint,
    getProjectRoot,
    getPackageJson,
    getPeerDeps,
} from "./util.js";
import { resolve } from "node:path";
import type { Bundler } from "./api/Bundler.ts";
import { ImportData } from "./api/Import.js";

export class ESBuildBundler implements Bundler {
    static async bundle(importData: ImportData): Promise<string> {
        const entryPoint = createAndGetEntryPoint(importData.importString);
        const projectRoot = getProjectRoot(importData.filePath);

        const result = await build({
            entryPoints: [entryPoint],
            bundle: true,
            nodePaths: [resolve(projectRoot, "node_modules")],
            outfile: "esbuild/dist/bundle.js",
            minify: true,
            sourcemap: false,
            treeShaking: true,
            external: getPeerDeps(importData),
        });

        return "esbuild/dist/bundle.js";
    }
}
