import { bundleAndWrite } from "./build.js";
import { getGzippedSize } from "./compressedSize.js";
import getConfig from "./rollup-config.js";

import { stat } from "node:fs/promises";

export default async function singleImportCost(
    filePath: string,
    importString: string
) {
    try {
        console.time("get config");
        const config = getConfig(filePath, importString);
        console.timeEnd("get config");

        console.time("bundle");
        const bundlePath = await bundleAndWrite(config);
        console.timeEnd("bundle");

        // console.time("stat");
        // const bundleStat = await stat(bundlePath);
        // console.timeEnd("stat");

        // console.log("bundle size", bundleStat.size);

        // console.time("gzipped size");
        // console.log("gzipped size", await getGzippedSize(bundlePath));
        // console.timeEnd("gzipped size");

        // console.log("bundle path", bundlePath);

        // return [bundleStat.size, await getGzippedSize(bundlePath)];
    } catch (e) {
        console.error(e);
    }
}

singleImportCost(
    // "/Users/Arsenii.Iusufov/WebstormProjects/untitled1/index.js",
    // "import _ from 'lodash'; console.log(_);"
    "/Users/Arsenii.Iusufov/jsprojects/eis-test-task/src/components/Router/Router.tsx",
    "import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'; console.log(createBrowserRouter, Navigate, RouterProvider);"
);
