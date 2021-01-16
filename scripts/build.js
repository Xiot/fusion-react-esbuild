const esbuild = require('esbuild');
const glob = require('tiny-glob');

(async () => {
  const entryPoints = await glob('./src/**/*.{cjs,js}');

  const startTime = Date.now();
  esbuild.build({
    entryPoints,
    target: ['node14'],
    outdir: './lib',
    platform: 'node',
    format: 'cjs',
    sourcemap: true
  }).then(result => {
    console.log(`SUCCESS: ${Date.now() - startTime}ms`);
  })
})();