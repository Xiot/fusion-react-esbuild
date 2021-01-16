import nodemon from 'nodemon';
import {Compiler} from './compiler/compiler.js';
import path from 'path';
import watch from 'node-watch';
import {fork} from 'child_process';
import {bus} from './bus';

const c = new Compiler();

const rebuild = () => {
  const startTime = Date.now();
  return c.build()
    .then(x => {
      console.log('build', Date.now() - startTime);
    });
}

function startServer() {
  const resolvedPath = require.resolve('fusion-build/lib/entry-server-instance.js');
  const paths = require.resolve.paths('fusion-build')
    .filter(x => !x.endsWith('fusion-build/node_modules'));

    const buildDir = path.join(process.cwd(), './snowpack/server')

    // const watcher = nodemon({
    //   script: path.join(buildDir, './entry-server-instance.js'),
      // args: [path.join(buildDir, './main.js')],

  return fork(
    path.join(__dirname, './entry-server-instance.js'),
    [path.join(buildDir, './main.js')],
    {env: {
      ...process.env,
      NODE_PRESERVE_SYMLINK: '1',
      NODE_PATH: paths.join(':')
    }}
  ).on('message', (...args) => {
    bus.emit('message', ...args);
    console.log('CHILD: ', ...args)
  });;
}
const delay = time => new Promise(resolve => setTimeout(resolve, time))
let instance = null;
(async function() {

  await rebuild();

  console.log('STARTING')
  instance = startServer()

  console.log('watching files');
  const watcher = watch('./src', {filter: /\.jsx?$/, recursive: true, delay: 100}, async (...args) => {
    console.log('file changes', ...args)
    bus.emit('message', 'server:down')

    await rebuild();
    await delay(1000);

    instance.kill('SIGINT');

    instance = startServer();
  });

  process.on('SIGINT', () => {
    watcher.close();
    instance && instance.kill('SIGINT');
    c.dispose();
    process.exit();
  })

// c.dispose();
// console.log('after');
// // await import('./entry-server-instance.js');
// let tick;
// // return;

// console.log('cwd', process.cwd())
// const buildDir = path.join(process.cwd(), './snowpack/server')

// const watcher = nodemon({
//   script: path.join(buildDir, './entry-server-instance.js'),
//   args: [path.join(buildDir, './main.js')],
//   ext: 'js',
//   watch: [
//     'src/**/*.js'
//   ]
// })
// .on('start', x =>  {

//   console.log('started', Date.now() - tick);
// })
// .on('restart', x => {
//   tick = Date.now();
//   console.log('restarted', x);
//   rebuild();
// })
// .on('exit', () => {
//   console.log('exit')
// })
// .once('quit', () => {
//   console.log('quitting');
//   // c.dispose()
// })
// ;

// process.on('SIGINT', () => {

//   watcher.emit('quit')
//   process.exit(0);
// });
})();