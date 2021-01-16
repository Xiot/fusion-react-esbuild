import {startService} from 'esbuild';
import path from 'path';
import {promises as fs} from 'fs';
import flowRemoveTypes from 'flow-remove-types';

const removeEmptyImports = /^import ['|"].+$/gm;

function getRelativePath(fullPath, config) {
  for(let [sourcePath, opt] of Object.entries(config.mount)) {
    if (fullPath.startsWith(sourcePath)) {
      return path.join(opt.url, fullPath.slice(sourcePath.length))
    }
  }
}

let esbuildService = null;
module.exports = function esbuildPlugin(config, opts) {
  let esbuildService = undefined;
  return {
    name: '@snowpack/plugin-esbuild-local',
    resolve: {
      input: ['.js'],
      output: ['.js'],
    },
    async run() {
      esbuildService = await startService();
    },
    async load({filePath, isSSR, isDev}) {

      const relativePath = getRelativePath(filePath, config);

      const originalSource = await fs.readFile(filePath, 'utf8')
      const flowResult = flowRemoveTypes(originalSource, {pretty: true});
      const flowMap = flowResult.generateMap();
      flowMap.sources = [relativePath];

      // Inline sourcemaps
      const flowMapUrl = `data:application/json;base64,` +
        Buffer.from(JSON.stringify(flowMap)).toString('base64');
      const contents = flowResult.toString() + '\n//# sourceMappingURL=' + flowMapUrl;

      const buildOptions = {
        loader: 'jsx',
        charset: 'utf8',
        sourcefile: relativePath,
        sourcemap: config.buildOptions.sourcemap ? 'both' : false,
        ...opts.esbuild,
        define: {
          __NODE__: isSSR,
          __BROWSER__: !isSSR,
          __DEV__: isDev,
          ...(opts.esbuild?.define ?? {})
        }
      };
      const startTime = Date.now();

      const {code, map: mapAsText, warnings} = await esbuildService.transform(contents, buildOptions);
      console.log('build', relativePath, Date.now() - startTime);

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
          // Removes imports with no specifiers (assumes no side-effects)
          code: code.replace(removeEmptyImports, ''),
          map,
        }
      };
    },
    cleanup() {
      esbuildService && esbuildService.stop();
    },
  };
}