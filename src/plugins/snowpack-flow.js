const flowRemoveTypes = require('flow-remove-types');
const fs = require('fs');

console.log('LOAD')

let flowTime = 0;
module.exports = function(config, pluginOptions) {
  return {
    name: 'remove-flow',
    resolve: {input: ['.js'], output: ['.js']},
    load(args) {
      console.log('esbuild.load', args.filePath);
      // console.log('ARGS', args);
      const startTime = Date.now();
      let data = fs.readFileSync(args.filePath, 'utf-8');
      if (
        data.slice(0, 8) === '// @flow' ||
        data.includes('// @flow') ||
        data.match(/^\/\*.*@flow.*\*\//)
      ) {
        data = flowRemoveTypes(data, { pretty: false }).toString();
      }

      flowTime += Date.now() - startTime;
      // if (args.filePath.endsWith('hello.js')) {
      //   console.log(data);
      // }
      return Promise.resolve(data);
    },
  }
};