# single-import-cost

This package provides an utility which bundles a dummy project with a single import to estimate the size of a given import.
Calculates size of tree-shaken, minified code.

_Under development._

Uses:

-   esbuild/rollup with few plugins
-   TypeScript

## Installation

```sh
npm i electfreak/single-import-cost
```

## Usage

Main function is located in [index.ts](./src/index.ts). To call it:

```ts
import singleImportCost from "single-import-cost";

singleImportCost(
    importData: ImportData, 
    bundler: Bundler, // esbuild by default
    timeoutMs: number // 3'000 by deafult
)

interface ImportData {
    filePath: string;     // path to file with import
    importString: string; // import taken from this file with some usage of imported modules
    importPath: string;   // import specifier
}
```

## Testing

Was tested with VSCode extension tests (see below) – easy to to adapt to them. Most tests didn't show significant difference from those import-cost implementation.
No own tests for now.

## Related:

-   [VSCode import-cost](https://github.com/wix/import-cost/tree/master) (initial inspiration)
-   Used by [plugin for intellij](https://github.com/electfreak/single-import-cost-ij-plugin)

TODO:

-   write tests?
-   publish package?
-   add caching?
-   add some configuration (e.g. whether to calc gzip/brotli)
