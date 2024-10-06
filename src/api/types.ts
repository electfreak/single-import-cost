export abstract class Bundler {
    /**
     * @param importData
     * @returns path to the bundle; it's bundler's responsibility to put bundle in tmp place
     */
    static bundle(importData: ImportData): Promise<string> {
        throw new Error("Not implemented");
    }
}

export interface Result extends ImportData {
    size: number;
    gzip: number;
    error: String | null;
}

export interface ImportData {
    filePath: string;
    importString: string;
    importPath: string;
}
