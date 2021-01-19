export default () => {
  return {
    name: "esbuild-external",
    setup(build) {
      // Initial resolve if not a relative path
      build.onResolve({ filter: /^[^\.\/]/ }, args => {
        return {external: true}
      });
    }
  }
}