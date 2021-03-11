import path from 'path';

const esbuild = {
  define: {
    __NODE__: false,
    __BROWSER__: true,
  },
  target: ['es2020'],
  format: 'esm',
  keepNames: false,
  minifySyntax: true,
  treeShaking: 'ignore-annotations',
}

const cwd = process.cwd();

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  root: cwd,
  exclude: [
    '**/esbuild/**/*',
    '**/plugins/**/*',
    '**/.fusion/**/*'
  ],
  packageOptions: {
    polyfillNode: true,
    rollup: {
      plugins: [require('rollup-plugin-pnp-resolve')()],
    },
  },
  devOptions: {
    port: 4001,
    hmr: true,
    secure: true,
    open: 'none',
    output: 'stream'
  },
  buildOptions: {
    out: path.join(cwd, './snowpack/client'),
    sourcemap: true,
    clean: true,
  },
  plugins: [
    [path.join(__dirname, './plugins/snowpack-esbuild.js'), {esbuild}],
    [path.join(__dirname, './plugins/babel-transform'), {
      transformOptions: {
        plugins: [
          path.join(__dirname, './plugins/babel-expand-declarations.js')
        ]
      }
    }],
    '@snowpack/plugin-react-refresh'
  ],
  mount: {
    src: '/'
  }
};

