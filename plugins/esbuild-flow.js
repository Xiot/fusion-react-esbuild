const flowRemoveTypes = require('flow-remove-types');
const fs = require('fs');

module.exports = {
  name: 'remove-flow',
  setup(build) {
    build.onLoad({ filter: /\.js$/ }, args => {
      // console.log('remove', args.path);
      const startTime = Date.now();
      let data = fs.readFileSync(args.path, 'utf-8');
      if (
        data.slice(0, 8) === '// @flow' ||
        data.includes('// @flow') ||
        data.match(/^\/\*.*@flow.*\*\//)
      ) {
        // console.log('  removed');
        data = flowRemoveTypes(data, { pretty: true }).toString();
      }
      // const contents = flowRemoveTypes(data).toString();
      // console.log(contents);

      // if (args.path.endsWith('src/components/shell.js')) {
      //   console.log(data);
      // }
      flowTime += Date.now() - startTime;
      return {
        contents: data,
        loader: 'jsx',
      };
    });
  },
};