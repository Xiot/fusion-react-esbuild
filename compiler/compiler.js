import esbuild from 'esbuild';
import buildPlugin from '../plugins/esbuild-flow.mjs'

const compile = (opts) => esbuild.build({
  bundle: true,
  outdir: './snowpack/server2',
  entryPoints: ['./src/main.js'],
  external: [
    'fusion-core',
    'fusion-react',
    'react',
    'react-dom'
  ],
  define: {
    '__NODE__': true,
    '__BROWSER__': false,
  },
  plugins: [
    buildPlugin
  ],
  platform: 'node',
  sourcemap: true,
  format: 'cjs',
  outExtension: {
    '.js': '.cjs'
  },
  target: 'node14',
  charset: 'utf8',
  keepNames: true,
  incremental: true,
  minifySyntax: true,
  ...opts
})

export class Compiler {
  constructor(opts) {
    this.opts = opts || {};
  }

  async build() {
    if (this._rebuild) {
      return await this._rebuild();
    }
    const results = await compile(this.opts);
    this._rebuild = results.rebuild;
    return results;
  }

  dispose() {
    this._rebuild?.dispose();
  }
}
