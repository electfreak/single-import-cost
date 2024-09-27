import { rollup, RollupBuild, RollupOptions } from "rollup";
import _terser from "@rollup/plugin-terser";
// shit, but common: https://github.com/rollup/plugins/issues/1662; TODO fix in future
const terser = _terser as unknown as typeof _terser.default;

import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { mkdtemp } from "node:fs/promises";

/**
 * @returns {Promise<string>} - path to the bundle
 * @param config
 */
export async function bundleAndWrite(config: RollupOptions): Promise<string> {
    const tempDirPrefix = `rollup-plugin-${Date.now()}`;
    const tempDir = await mkdtemp(join(tmpdir(), tempDirPrefix));
    const bundlePath = resolve(tempDir, "bundle.js");
    const bundle = await rollup(config);
    const { output } = await bundle.generate({
        format: "es",
        // file: bundlePath,
        plugins: [
            terser({
                maxWorkers: 1,
            }),
        ],
    });
    await bundle.close();

    // console.log("output", output);

    return bundlePath;
}
