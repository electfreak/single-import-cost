import type { ImportData } from "./Import.ts";

export abstract class Bundler {
    /**
     * @param importData
     * @returns path to the bundle; it's bundler's responsibility to put bundle in tmp place
     */
    static bundle(importData: ImportData): Promise<string> {
        throw new Error("Not implemented");
    }
}
