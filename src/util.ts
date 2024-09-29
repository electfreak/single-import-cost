import {
    createReadStream,
    createWriteStream,
    existsSync,
    mkdtempSync,
    readFileSync,
    writeFileSync,
} from "node:fs";
import { stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, parse } from "node:path";
import { createGzip } from "node:zlib";
import { ImportData } from "./api/Import.js";

export function createAndGetEntryPoint(importString: string): string {
    const tempDir = mkdtempSync(join(tmpdir(), `rollup-plugin`));
    let entryPointPath = join(tempDir, "file.js");
    writeFileSync(entryPointPath, importString, "utf-8");
    return entryPointPath;
}

export function getProjectRoot(filePath: string): string {
    const { root } = parse(filePath);
    let currPath = filePath;
    while (currPath != root) {
        currPath = resolve(currPath, "..");
        if (existsSync(resolve(currPath, "package.json"))) {
            return currPath;
        }
    }

    throw new Error(
        `Unable to find ancestor folder with package.json for ${filePath}`
    );
}

function getPackageName(importPath: string): string | null {
    if (importPath.startsWith(".") || importPath.startsWith("/")) {
        return null;
    }

    if (importPath.startsWith("@")) {
        const parts = importPath.split("/");
        if (parts.length > 1) {
            return `${parts[0]}/${parts[1]}`; //  scoped package
        }
    }

    const firstSlash = importPath.indexOf("/");
    if (firstSlash === -1) {
        return importPath; // average package
    }

    return importPath.substring(0, firstSlash); // "package/module" -> "package"
}

export function getPackageDir({ filePath, importPath }: ImportData) {
    const { root } = parse(filePath);
    let currPath = filePath;
    const packageName = getPackageName(importPath);
    if (packageName == null)
        throw new Error(`No package name found for ${importPath}`);

    while (currPath != root) {
        const projectRoot = getProjectRoot(currPath);
        const packageDir = resolve(projectRoot, "node_modules", packageName);
        if (existsSync(packageDir)) {
            return packageDir;
        }

        currPath = resolve(projectRoot, "..");
    }

    throw new Error(`Unable to find package directory for ${filePath}`);
}

export function getPackageJson(importData: ImportData) {
    const packageDir = getPackageDir(importData);
    const packageJsonPath = resolve(packageDir, "package.json");
    return JSON.parse(readFileSync(packageJsonPath, "utf-8"));
}

export async function getSize(filePath: string) {
    const fileStat = await stat(filePath);
    return fileStat.size;
}

export function getPeerDeps(importData: ImportData): string[] {
    const packageJson = getPackageJson(importData);
    return Object.keys(packageJson.peerDependencies ?? {});
}

export async function getGzippedSize(filePath: string) {
    const tmpFile = join(tmpdir(), "gzipped");
    const gzipStream = createGzip();
    const outputStream = createWriteStream(tmpFile);
    const stream = createReadStream(filePath)
        .pipe(gzipStream)
        .pipe(outputStream);

    await new Promise((resolve, reject) => {
        stream.on("finish", () => {
            resolve(outputStream);
        });

        stream.on("error", (err) => {
            reject(err);
        });
    });

    const fileStat = await stat(tmpFile);
    return fileStat.size;
}
