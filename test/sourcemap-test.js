import flowRemoveTypes from 'flow-remove-types';
import esbuild from 'esbuild';
import fs from 'fs';
import {Compiler} from '../src/compiler/compiler.js';

import refreshPluginFactory from '@snowpack/plugin-react-refresh';

const source = fs.readFileSync('./src/components/hello.js', 'utf-8');

const flowResult = flowRemoveTypes(
  source,
  {pretty: false}
);

const result = await compile(
  flowResult.toString(),
  {sourcemap: 'inline'}
);
// console.log(result);

const plugin = refreshPluginFactory({
  devOptions: {hmr: true},
  buildOptions: {sourceMaps: true}
}, {babel: true});
const pluginResult = await plugin.transform({contents: result.code, fileExt: '.js', id: 'hello.js', isDev: true})
// console.log(pluginResult);

saveResult(pluginResult);

function saveResult(result) {
  fs.writeFileSync('./test-map.js', result.code || result.contents, 'utf-8');
  if (result.map)
    fs.writeFileSync('./test-map.js.map', JSON.stringify(result.map), 'utf-8');
}



async function compile(source, opts = {}) {

  const result = await esbuild.transform(source, {
    define: {
      '__NODE__': true,
      '__BROWSER__': false,
    },
    sourcemap: true,
    format: 'esm',
    target: 'node14',
    charset: 'utf8',
    keepNames: true,
    loader: 'jsx',
    ...opts
  })

  return {
    code: result.code,
    map: result.map && JSON.parse(result.map)
  }
}