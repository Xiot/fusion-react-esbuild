import path from 'path';

const esbuild = {
  define: {
    // __NODE__: false,
    // __BROWSER__: true,
    // __DEV__: true
  },
  target: ['es2020'],
  format: 'esm',
  keepNames: false,
  minifySyntax: true,
  treeShaking: 'ignore-annotations',
}

console.log('PWD', process.cwd())
const cwd = process.cwd();

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  root: process.cwd(),
  exclude: [
    '**/esbuild/**/*',
    '**/plugins/**/*',
    '**/.fusion/**/*'
  ],
  packageOptions: {
    polyfillNode: true,
  },
  devOptions: {
    port: 4001,
    hmr: true,
    // hmrPort: 4004,
    secure: false,
    // hmrDelay: 1000,
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
    // [path.join(__dirname, './plugins/snowpack-flow.js')],
    // ['@snowpack/plugin-babel', {
    //   input: ['.js'],
    //   transformOptions: {
    //     presets: ['@babel/preset-flow', '@babel/preset-react'],
    //     plugins: [
    //       ['babel-plugin-transform-prune-unused-imports', {
    //         falsyExpressions: ['__NODE__'],
    //         trutyExpressions: ['__BROWSER__']
    //       }]
    //     ]
    //   }
    // }],
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

