
// console.log('parent')
// console.log('cwd', process.cwd());
// console.log('r', require.resolve('fusion-build/lib/entry.js'))
// console.log();

// const paths = require.resolve.paths('fusion-core')
//   .filter(x => !x.endsWith('fusion-build/node_modules'));
// console.log('paths', paths);

// require('child_process').fork(
//   require('path').join(__dirname, './entry-server-instance.js'),
//   { env: {
//     ...process.env,
//     NODE_PATHS: paths.join(':')
//   }}
// )

import {bus} from './bus';

import fs from 'fs';
import path from 'path';
import 'source-map-support/register';


fs.copyFileSync(
  path.join(__dirname, 'entry-server-instance.js'),
  './snowpack/server/entry-server-instance.js'
);

bus.on('message', (...args) => {
  console.log('ENTRY MESSAGE', ...args);
});

const args = process.argv.slice(2);
if (args[0] === 'client') {
  const {execSync} = require('child_process');
  execSync('snowpack build --config ../fusion-react-esbuild/lib/snowpack.client.config.js');
  return;
}

(async () => {
  await import('./entry-client.js');
  await import('./entry-server.js');
})();

