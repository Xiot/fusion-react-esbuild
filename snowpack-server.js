
import fs from 'fs';
import {startDevServer, createConfiguration} from 'snowpack';
import createReactRefresh from '@snowpack/plugin-react-refresh';
import babel from '@babel/core';
import esbuild from 'esbuild';

import http from 'http';
import URL from 'url';

import clientConfig from './snowpack.client.config.js';
import { SSRBodyTemplateToken, createPlugin } from 'fusion-core';

const [err, norm] = createConfiguration(clientConfig);

const server = startDevServer({
  config: norm,
  cwd: '/Users/tchrs@uber.com/dev/github/xiot/fusion-react-esbuild'
}).then(x => {
  console.log('started', x.port);
  return x;
}).then(async pack => {

  // const app = await (await import('./snowpack/server2/main.cjs'))
  const appImport = await import('./snowpack/server2/main.cjs');
  // console.log(appImport);
  const app = appImport.default.default();
  // console.log('app', app);

  const ssrPlugin = createPlugin({
    deps: {},
    provides() {
      return async ctx => {
        console.log('SSR');
        const result = await pack.loadUrl(ctx.url);
        const body = result.contents.toString().replace('__RENDERED_ELEMENT__', ctx.rendered)
        // console.log(body)
        return body;
      }
    }
  })
  app.register(SSRBodyTemplateToken, ssrPlugin);

  // console.log('app', app);
  const callback = app.callback();
  const httpServer = http.createServer(async (req, res) => {
    console.log(req.url);
    const {pathname} = URL.parse(req.url);

    if (pathname === '/') {

        callback(req, res);
        return;
        // SSR
        // const buildResult = await pack.loadUrl(req.url);
        // res.writeHead(200, {
        //   'content-type': buildResult.contentType
        // })
        // res.write(buildResult.contents);
        // res.end();
        // return;
    }

    if (pathname.endsWith('.js')) {
      const buildResult = await pack.loadUrl(req.url);
      res.writeHead(200, {
        'content-type': buildResult.contentType
      })
      res.write(buildResult.contents);
      res.end();
    } else {
      callback(req, res);
    }
  }).listen(4003, () => console.log('listening'));

  process.once('SIGUSR2', async () => {
    console.log('shutting down')
    await pack.shutdown();
    console.log('shutdown');
    process.kill(process.pid, 'SIGUSR2');
  });

  return pack;
}).catch(ex => {
  console.error(ex);
  process.exit(1)
});

