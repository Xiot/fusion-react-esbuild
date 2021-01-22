import App from 'fusion-react';

import DefaultRoot from './components/fusion-root';
import {RenderToken} from 'fusion-core';
import {TimeToken, TimePlugin} from './plugins/time';
import I18n, {
  I18nToken,
  I18nLoaderToken,
  createI18nLoader,
} from 'fusion-plugin-i18n-react';
import {FetchToken, LoggerToken} from 'fusion-tokens';
import fetch from './utils/fetch';


export default function start(root, render) {
  const el = root || DefaultRoot;

  const app = new App(el, render);

  app.register(I18nToken, I18n);
  app.register(LoggerToken, console);

  if (__NODE__) {
    app.register(TimeToken, TimePlugin);
  }

  __NODE__
    ? app.register(I18nLoaderToken, createI18nLoader())
    : app.register(FetchToken, fetch)

  // console.log(app);
  return app;
}