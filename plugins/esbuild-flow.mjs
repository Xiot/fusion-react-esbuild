import flowRemoveTypes from 'flow-remove-types';
import fs from 'fs';
import path from 'path';

export default {
  name: 'remove-flow',
  setup(build) {
    build.onLoad({ filter: /\.js$/ }, args => {
      const startTime = Date.now();
      let data = fs.readFileSync(args.path, 'utf-8');
      if (
        data.slice(0, 8) === '// @flow' ||
        data.includes('// @flow') ||
        data.match(/^\/\*.*@flow.*\*\//)
      ) {

        const result = flowRemoveTypes(data, { pretty: true });
        data = result.toString();
        data += `\n//# sourceMappingURL=${path.basename(args.path)}.map}`
      }

      // if (data.includes('require(')) {
      //   const lines = data.split('\n').filter(line => line.includes('require('));
      //   console.log(args.path);
      //   lines.forEach(line => console.log(' ', line));
      // }

      return {
        contents: data,
        loader: 'jsx',
      };
    });
  },
};