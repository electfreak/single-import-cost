import { getGzippedSize, getSize, runWithTimeout } from "./util.js";
import type { ImportData, Result } from "./api/types.ts";
import { ESBuildBundler } from "./ESBuildBundler.js";
import { Bundler } from "./api/types.js";

const DEFAULT_TIMEOUT = 3000;

export default async function singleImportCost(
    importData: ImportData,
    bundler: typeof Bundler = ESBuildBundler,
    timeoutMs: number = DEFAULT_TIMEOUT
): Promise<Result> {
    try {
        const result = await runWithTimeout(
            bundler.bundle(importData),
            timeoutMs
        );

        return {
            ...importData,
            error: null,
            size: await getSize(result),
            gzip: await getGzippedSize(result),
        };
    } catch (e) {
        return {
            ...importData,
            error: e instanceof Error ? e.message : String(e),
            size: 0,
            gzip: 0,
        };
    }
}
