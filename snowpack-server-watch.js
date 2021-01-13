import nodemon from 'nodemon';
import {Compiler} from './compiler/compiler.js';

const c = new Compiler();

const rebuild = () => {
  const startTime = Date.now();
  c.build()
    .then(x => {
      console.log('build', Date.now() - startTime);
    });
}

rebuild();

const watcher = nodemon({
  script: './snowpack-server.js',
  ext: 'js',
  watch: [
    'src/**/*.js'
  ]
})
.on('start', x =>  {
  console.log('started', x);
})
.on('restart', x => {
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
