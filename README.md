# single-import-cost

This package provides an utility which bundles a dummy project with a single import to estimate the size of a given import.
Calculates size of tree-shaken, minified code.

Uses:

-   esbuild/rollup with few plugins
-   TypeScript

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

## Testing

No own tests for now but was tested with VSCode extension tests (see below) – easy to to adapt to them. Most tests didn't show significant difference from those import-cost implementation.

## Related:

-   [VSCode import-cost](https://github.com/wix/import-cost/tree/master) (initial inspiration)

TODO:

-   write tests?
-   add timeout?
-   publish package?
-   add caching? 
-   add some configuration (e.g. whether to calc gzip/brotli)
