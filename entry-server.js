import nodemon from 'nodemon';
import {Compiler} from './compiler/compiler.js';

const c = new Compiler();

const rebuild = () => {
  const startTime = Date.now();
  return c.build()
    .then(x => {
      console.log('build', Date.now() - startTime);
    });
}


process.on('child', args => console.log('child', args))


await rebuild();
// await import('./entry-server-instance.js');
let tick;

const watcher = nodemon({
  script: './entry-server-instance.js',
  ext: 'js',
  watch: [
    'src/**/*.js'
  ]
})
.on('start', x =>  {

  console.log('started', Date.now() - tick);
})
.on('restart', x => {
  tick = Date.now();
  console.log('restarted', x);
  rebuild();
})
.on('exit', () => {
  console.log('exit')
})
.once('quit', () => {
  console.log('quitting');
  // c.dispose()
})
;

process.on('SIGINT', () => {

  watcher.emit('quit')
  process.exit(0);
});
