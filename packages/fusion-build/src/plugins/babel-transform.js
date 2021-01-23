const babel = require('@babel/core');

module.exports = function plugin(snowpackConfig, options = {}) {
  return {
    name: '@snowpack/plugin-babel-transform',
    async transform({contents, fileExt, id, isDev}){
      if (!contents || fileExt !== '.js') {
        return;
      }

      let encodedResult = await babel.transformAsync(contents, {
        caller: {
          name: '@snowpack/plugin-babel-transform',
          supportsStaticESM: true,
          supportsDynamicImport: true,
          supportsTopLevelAwait: true,
          supportsExportNamespaceFrom: true,
        },
        cwd: snowpackConfig.root || process.cwd(),
        ast: false,
        compact: false,
        sourceMaps: snowpackConfig.buildOptions.sourcemap || snowpackConfig.buildOptions.sourceMaps,
        ...(options.transformOptions || {}),
      });

      let {code, map} = encodedResult;

      if (code) {
        // Some Babel plugins assume process.env exists, but Snowpack
        // uses import.meta.env instead. Handle this here since it
        // seems to be pretty common.
        // See: https://www.pika.dev/npm/snowpack/discuss/496
        code = code.replace(/process\.env/g, 'import.meta.env');
      }
      return {
        contents: code,
        map,
      }
    },
    cleanup() {

    },
  };
};
