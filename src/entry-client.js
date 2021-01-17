import http from 'http';
import { startServer as startDevServer, createConfiguration } from 'snowpack';
import URL from 'url';
import path from 'path';

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
});

let snowpack;
serverProxy.on('proxyRes', async (proxyRes, req, res) => {
  // console.log('proxy res', proxyRes.statusCode, proxyRes.headers)

  const bodyText = await readBody(proxyRes);

  Object.entries(proxyRes.headers)
    .filter(([key]) => key !== 'content-length')
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
      // console.log('proxy', req.url, req.headers);


      await waitForServer();

      try {
        const s = Date.now();
        res.once('finish', () => console.log(Date.now() - s));
        serverProxy.web(req, res, {selfHandleResponse: true});
      } catch (ex) {
        res.writeHead(500, {'content-type': 'application/json'});
        res.end(JSON.stringify({message: 'failed to forward request. ' + ex.message, stack: ex.stack}))
      }
    }}
  ]
});

// console.log('CONFIG', snowpackConfig);
snowpack = await startDevServer({
  config: snowpackConfig,
  // cwd: '/Users/tchrs@uber.com/dev/github/xiot/fusion-react-esbuild/src',
});

// serverProxy.on('proxyRes', (proxyRes, req, res) => {
//   proxyRes.on('data', data => console.log(data.toString()))
// })

const shouldHandle = pathname => {
  const ext = path.extname(pathname);
  return !!ext;
}

// const httpServer = http.createServer(async (req, res) => {
//   const url = URL.parse(req.url);
//   const {pathname} = url;

//   // console.log(pathname);
//   if (req.protocol === 'ws') {
//     snowpack.handleRequest(req, res);
//     return;
//   }

//   if (shouldHandle(pathname)) {
//     snowpack.handleRequest(req, res)
//     return;
//   }

//   // detect if server is restarting and wait until it comes back to send the request.
//   serverProxy.web(req, res);
// }).listen(DEV_CLIENT_PORT, () => console.log('client listening', DEV_CLIENT_PORT))
})();