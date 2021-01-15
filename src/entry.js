
import fs from 'fs';
import path from 'path';

fs.copyFileSync(
  path.join(__dirname, 'entry-server-instance.js'),
  './snowpack/server/entry-server-instance.js'
);

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

