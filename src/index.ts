import { stat } from "node:fs/promises";
import { getGzippedSize, getPackageDir, getPackageJson } from "./util.js";

import type { ImportData } from "./api/Import.ts";
import { RollupBundler } from "./RollupBundler.js";
import { ESBuildBundler } from "./ESBuildBundler.js";
import { Bundler } from "./api/Bundler.js";

const sampleOne: ImportData = {
    filePath: "/Users/Arsenii.Iusufov/WebstormProjects/untitled1/index.js",
    importString: "import _ from 'lodash'; console.log(_);",
    importPath: "lodash",
};

const sampleTwo: ImportData = {
    filePath:
        "/Users/Arsenii.Iusufov/jsprojects/eis-test-task/src/components/Router/Router.tsx",
    importString:
        "import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'; console.log(createBrowserRouter, Navigate, RouterProvider);",
    importPath: "react-router-dom",
};

interface Result {
    size: number;
    gzip: number;
}

export default async function singleImportCost(
    importData: ImportData,
    bundler: typeof Bundler = ESBuildBundler
): Promise<Result> {
    try {
        const result = await bundler.bundle(importData);

        return {
            size: (await stat(result)).size,
            gzip: await getGzippedSize(result),
        };
    } catch (e) {
        console.error(e);

        return {
            size: 0,
            gzip: 0,
        };
    }
}

console.log(await singleImportCost(sampleOne));
// singleImportCost(sampleTwo);
// 10.6
