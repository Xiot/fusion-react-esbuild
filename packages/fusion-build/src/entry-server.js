import nodemon from 'nodemon';
import {Compiler} from './compiler/compiler.js';
import path from 'path';
import {watch} from 'chokidar';
import {fork} from 'child_process';
import {bus} from './bus';
import fs from 'fs';
import { buildOptions } from '../lib/snowpack.client.config.js';

const c = new Compiler();

const rebuild = () => {
  const startTime = Date.now();
  return c.build()
    .then(x => {
      console.log('build', Date.now() - startTime);
    });
}

function startServer() {

  const buildDir = path.join(process.cwd(), './snowpack/server')

  return fork(
    path.join(__dirname, './entry-server-instance.js'),
    [path.join(buildDir, './main.js')],
  ).on('message', (...args) => {
    bus.emit('message', ...args);
  });;
}
const delay = time => new Promise(resolve => setTimeout(resolve, time))
let instance = null;
(async function() {

  await rebuild();

  console.log('STARTING')
  instance = startServer()

  console.log('watching files');
  const watcher = watch('./src/**/*', {persistent: true, ignoreInitial: true})
    .on('all', debounce(100, async (paths) => {
      console.log('file changes', paths)
      bus.emit('message', 'server:down')

      await rebuild();

      instance.kill('SIGINT');

      instance = startServer();
  }));

  process.on('SIGINT', () => {
    watcher.close();
    instance && instance.kill('SIGINT');
    c.dispose();
    process.exit();
  })

})();

function debounce(duration, handler) {

  let paths = []
  let handle = null;
  return (event, path) => {
    paths.push(path);
    if (handle) {
      clearTimeout(handle);
    }
    handle = setTimeout(() => {
      const clone = [...paths];
      paths = [];
      handle = null;
      handler(clone);
    }, duration);
  }
}