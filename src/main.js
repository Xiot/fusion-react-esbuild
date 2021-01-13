import App from 'fusion-react';

import DefaultRoot from './components/fusion-root';
import {RenderToken} from 'fusion-core';

export default function start(root, render) {
  const el = root || DefaultRoot;
  // const app = new App(el, (...args) => {
  //   console.trace('render', render);
  //   if (!render) return el;
  //   return render(...args);
  // });
  // return app;
  const app = new App(el, render);
  if (__NODE__) {
    // console.log(SSRBodyTemplateToken);
    // app.register(RenderToken, () => "<div id='root'></div>");
    app.middleware((ctx, next) => {
      if (ctx.method === 'GET' && ctx.path === '/time') {
        ctx.body = {time: 'other ' +  Date.now()}
      }
      return next()
    })
  }

  // if (!__NODE__) {
  //   return new Proxy(app, {
  //     get(target, key, receiver) {
  //       const value = Reflect.get(target, key, receiver);
  //       console.log('app.key', key, value);
  //       if (key === 'resolve')
  //       console.trace('resolve');
  //       return value;
  //     }
  //   })
  // }

  return app;
}