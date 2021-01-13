const {addHook} = require('pirates');
const {createTransformer} = require('./compiler/transform');
const {startService} = require('esbuild');

(async function() {
  const service = await startService();
  const compiler = createTransformer(service);

  const esbuildOptions = {
    define: {
      __NODE__: false,
    },
    target: ['es2020'],
    format: 'esm',
  }

  const revert = addHook(
    (code, filename) => compiler({filePath: filename, source: code}, {esbuild: esbuildOptions}).code,
    {exts: ['.js']}
  )

  const {server} = require('./snowpack-server');
  await server.start();
  await server.wait();
})();