# single-import-cost

This packages provides an utility which bundles a dummy project with a single import to estimate the size of a given import.
Calculates size of tree-shaken, minified code.

Uses:

-   esbuild/rollup with few plugins
-   TypeSript

## Usage

Main function is located in [index.ts](./src/index.ts). To call it:

```ts
singleImportCost(importData: ImportData, bundler: Bundler /* esbuild by default */)

interface ImportData {
    filePath: string;     // path to file with import
    importString: string; // import taken from this file with some usage of imported modules
    importPath: string;   // import specifier
}

```

Related:

-   [VSCode import-cost](https://github.com/wix/import-cost/tree/master) (initial inspiration)

TODO:

-   write tests?
