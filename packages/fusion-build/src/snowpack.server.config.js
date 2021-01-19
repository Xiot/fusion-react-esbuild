
const esbuild = {
  define: {
    __NODE__: true,
    __BROWSER__: false,
    __DEV__: true,
  },
  target: ['node14.15'],
  format: 'esm',
  keepNames: false
  // mainFields: ['module']
  // platform: 'node'
}

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  exclude: [
    '**/esbuild/**/*',
    '**/plugins/**/*',
    '**/.fusion/**/*'
  ],
  alias: {
    // 'fusion-core': lookupRoot('fusion-core'),
  },
  installOptions: {
    sourceMap: true,
    // treeshake: false,
    externalPackage: [
      'assert', 'fs'
    ],
    packageLookupFields: ['module', 'main']
  },
  devOptions: {
    port: 4001,
    hmr: true,
    open: 'none',
  },
  buildOptions: {
    out: './snowpack/server',
    sourceMaps: true,
    clean: true,
  },
  plugins: [
    ['./plugins/snowpack-esbuild.cjs', {esbuild}],
  ],
  mount: {
    src: '/'
  }
};
