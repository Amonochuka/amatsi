module.exports = [
"[turbopack-node]/transforms/postcss.ts?config=[project]/frontend/frontend/postcss.config.js { CONFIG => \"[project]/frontend/frontend/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/0hwa_1fu5q3z._.js",
  "chunks/[root-of-the-server]__13y5eni._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts?config=[project]/frontend/frontend/postcss.config.js { CONFIG => \"[project]/frontend/frontend/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];