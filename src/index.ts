import { getGzippedSize, getSize } from "./util.js";
import type { ImportData, Result } from "./api/types.ts";
import { ESBuildBundler } from "./ESBuildBundler.js";
import { Bundler } from "./api/types.js";

export default async function singleImportCost(
    importData: ImportData,
    bundler: typeof Bundler = ESBuildBundler
): Promise<Result> {
    try {
        const result = await bundler.bundle(importData);

        return {
            ...importData,
            size: await getSize(result),
            gzip: await getGzippedSize(result),
        };
    } catch (e) {
        console.error(e);

        return {
            ...importData,
            size: 0,
            gzip: 0,
        };
    }
}
