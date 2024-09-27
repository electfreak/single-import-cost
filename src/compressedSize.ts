import { tmpdir } from "node:os";
import { mkdtemp, stat } from "node:fs/promises";
import { createGzip } from "node:zlib";
import { join } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";

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
