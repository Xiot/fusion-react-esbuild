import 'source-map-support/register';

import {bus} from './bus';

import fs from 'fs';
import path from 'path';
import {install} from 'esinstall';

const buildDir = path.join(process.cwd(), 'snowpack/server');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, {recursive: true});
}

fs.copyFileSync(
  path.join(__dirname, 'entry-server-instance.js'),
  path.join(buildDir, './entry-server-instance.js')
);

const args = process.argv.slice(2);
if (args[0] === 'client') {
  const {execSync} = require('child_process');
  const configPath = require.resolve('fusion-build/lib/snowpack.client.config.js')
  execSync(`snowpack build --config ${configPath}`);
  return;
}

(async () => {
  await import('./entry-client.js');
  await import('./entry-server.js');
})();

