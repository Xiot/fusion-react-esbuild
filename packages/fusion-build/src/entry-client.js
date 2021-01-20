import http from 'http';
import { startServer as startDevServer, createConfiguration, build } from 'snowpack';
import URL from 'url';
import path from 'path';
import fs from 'fs';

import clientConfig from './snowpack.client.config';
import httpProxy from 'http-proxy';
import {bus} from './bus';

const {
  DEV_CLIENT_PORT = 4003,
  DEV_SERVER_PORT = 4002
} = process.env;

let status = 'server:down';

function waitForServer() {
  if (status !== 'server:ready') {
    console.log('Waiting for server ...')
    return new Promise((resolve) => {
      bus.on('message', (type) => {
        if (type === 'server:ready') {
          console.log('Server is Ready. Continuing...');
          resolve();
        }
      });
    })
  }
  return Promise.resolve();
}

bus.on('message', (type, args) => {
  switch(type) {
    case 'server:down':
    case 'server:ready':
      console.log('set status', type);
      status = type;
  }
})

const serverProxy = httpProxy.createProxy({
  target: `http://localhost:${DEV_SERVER_PORT}`,
  ssl: {
    key: fs.readFileSync(path.join(process.cwd(), 'snowpack.key')),
    cert: fs.readFileSync(path.join(process.cwd(), 'snowpack.crt'))
  }
});

let snowpack;

serverProxy.on('proxyRes', async (proxyRes, req, res) => {
  // console.log('proxy res', proxyRes.statusCode, proxyRes.headers)

  const bodyText = await readBody(proxyRes);

  Object.entries(proxyRes.headers)
    .filter(([key]) => {
      if (key === 'content-length') {
        return false;
      }
      if (key[0] === ':') return false;
      return true;
    })
    .forEach(([key, value]) => res.setHeader(key, value));
  const contentType = proxyRes.headers['content-type'];

  if (contentType.includes('html')) {
    const r = await snowpack.loadUrl('/index.html')
    res.writeHead(proxyRes.statusCode, proxyRes.statusMessage);
    res.end(r.contents.toString().replace('__RENDERED_ELEMENT__', bodyText));
  } else {
    res.writeHead(proxyRes.statusCode, proxyRes.statusMessage);
    res.end(bodyText);
  }
})

const readBody = emitter => {
  return new Promise(resolve => {
    const data = [];
    emitter.on('data', chunk => data.push(chunk));
    emitter.on('end', () => resolve(Buffer.concat(data).toString()))
  })
}

(async function() {
const snowpackConfig = createConfiguration({
  ...clientConfig,
  routes: [
    {match: 'routes', src: '.*', async dest(req, res) {

      await waitForServer();

      try {
        serverProxy.web(req, res, {selfHandleResponse: true});
      } catch (ex) {
        console.log(ex);
        res.writeHead(500, {'content-type': 'application/json'});
        res.end(JSON.stringify({message: 'failed to forward request. ' + ex.message, stack: ex.stack}))
      }
    }}
  ]
});

// console.log('CONFIG', snowpackConfig);
snowpack = await startDevServer({
  config: snowpackConfig,
});

// const result = await build({
//   config: snowpackConfig
// });
// console.log('result', result);

})();