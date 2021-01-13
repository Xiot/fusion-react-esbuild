import {Compiler} from './compiler/compiler.js';

const c = new Compiler();
const result = await c.build();
c.dispose();

// import esbuild from 'esbuild';
// import buildPlugin from './plugins/esbuild-flow.mjs'
// /*
//  esbuild src/server/index.ts
// --platform=node --sourcemap --format=esm --outdir=dist/server --charset=utf8 && cp ./src/server/package.json ./dist/server/package.json && cp -r ./src/server/data/ ./dist/server/data/
// */
// const startTime = Date.now();
// esbuild.build({
//   bundle: true,
//   outdir: './snowpack/server2',
//   entryPoints: ['./src/main.js'],
//   external: [
//     'fusion-core',
//     'fusion-react',
//     'react',
//     'react-dom'
//   ],
//   define: {
//     '__NODE__': true,
//     '__BROWSER__': false,
//   },
//   // loader: 'jsx',
//   // loader: {
//   //   '.js': 'jsx'
//   // },
//   plugins: [
//     buildPlugin
//   ],
//   platform: 'node',
//   sourcemap: true,
//   format: 'cjs',
//   outExtension: {
//     '.js': '.cjs'
//   },
//   target: 'node14',
//   charset: 'utf8',
//   keepNames: true,
//   incremental: true
// }).then(x => {
//   console.log(x);
//   console.log(Date.now() - startTime);

//   const rs = Date.now();
//   return x.rebuild()
//     .then(y => {
//       console.log('rebuild', Date.now() - rs, y)
//       x.rebuild.dispose();
//     });

// })
