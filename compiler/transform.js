const {startService} = require('esbuild');
const path = require('path');
const fs = require( 'fs');
const flowRemoveTypes = require('flow-remove-types');

module.exports.createTransformer = (esbuildService) => {

  return ({filePath, source}, opts) => {
    console.log('transform', filePath);

    source = source || fs.readFileSync(filePath, 'utf8');

    const contents = flowRemoveTypes(source).toString();

    const isPreact = false;
    // let jsxFactory = config.buildOptions.jsxFactory ?? (isPreact ? 'h' : undefined);
    // let jsxFragment = config.buildOptions.jsxFragment ?? (isPreact ? 'Fragment' : undefined);
    const {code, map, warnings} = esbuildService.transformSync(contents, {
      loader: 'jsx',
      // jsxFactory,
      // jsxFragment,
      sourcefile: filePath,
      sourcemap: true, //config.buildOptions.sourceMaps,
      ...opts.esbuild
    });
    return {
      '.js': {
        code: code || '',
        map,
      },
    };
  }
}

