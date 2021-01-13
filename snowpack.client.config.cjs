
const esbuild = {
  define: {
    __NODE__: false,
    __BROWSER__: true,
    __DEV__: true
  },
  target: ['es2020'],
  format: 'esm',
  keepNames: false,
}

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
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
    hmrPort: 4004,
    open: 'none',
    output: 'stream'
  },
  buildOptions: {
    out: './snowpack/client',
    sourcemap: true,
    clean: true,
  },
  plugins: [
    ['./plugins/snowpack-esbuild.cjs', {esbuild}],
    '@snowpack/plugin-react-refresh'
  ],
  mount: {
    src: '/'
  }
};
