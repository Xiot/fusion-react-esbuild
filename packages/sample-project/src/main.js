import App from 'fusion-react';

import DefaultRoot from './components/fusion-root';
import {RenderToken} from 'fusion-core';
import {TimeToken, TimePlugin} from './plugins/time';

export default function start(root, render) {
  const el = root || DefaultRoot;

  const app = new App(el, render);
  if (__NODE__) {
    app.register(TimeToken, TimePlugin);
  }
  // console.log(app);
  return app;
}