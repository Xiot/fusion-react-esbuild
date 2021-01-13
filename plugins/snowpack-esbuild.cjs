const {startService} = require('esbuild');
const path = require('path');
const {promises:fs} = require( 'fs');
const flowRemoveTypes = require('flow-remove-types');

const basePath = '/Users/tchrs@uber.com/dev/github/xiot/fusion-react-esbuild/src';

let esbuildService = null;
module.exports = function esbuildPlugin(config, opts) {
  console.log(opts);
  return {
    name: '@snowpack/plugin-esbuild-local',
    resolve: {
      input: ['.js'],
      output: ['.js'],
    },
    async load({filePath}) {

      console.log('esbuild-local.load', filePath);
      esbuildService = esbuildService || (await startService());
      const originalSource = await fs.readFile(filePath, 'utf8')
      const flowResult = flowRemoveTypes(originalSource, {pretty: false});
      const flowMap = flowResult.generateMap();
      flowMap.sources = [filePath];

      const flowMapUrl = `data:application/json;base64,` +
        Buffer.from(JSON.stringify(flowMap)).toString('base64');
      const contents = flowResult.toString() + '\n//# sourceMappingURL=' + flowMapUrl;
      // const contents = flowResult.toString();

      const isPreact = false;
      let jsxFactory = config.buildOptions.jsxFactory ?? (isPreact ? 'h' : undefined);
      let jsxFragment = config.buildOptions.jsxFragment ?? (isPreact ? 'Fragment' : undefined);

      const buildOptions = {
        loader: 'jsx',
        charset: 'utf8',
        jsxFactory,
        jsxFragment,
        sourcefile: filePath, //path.relative(basePath, filePath),
        sourcemap: config.buildOptions.sourcemap,
        ...opts.esbuild
      };
      const {code, map: mapAsText, warnings} = await esbuildService.transform(contents, buildOptions);
      const map = mapAsText ? {
        ...JSON.parse(mapAsText),
        sourcesContent: [originalSource]
      } : undefined;

      for (const warning of warnings) {
        console.error(`'!' ${filePath}
  ${warning.text}`);
      }
      return {
        '.js': {
          code,
          map,
        }
      };
    },
    cleanup() {
      esbuildService && esbuildService.stop();
    },
  };
}