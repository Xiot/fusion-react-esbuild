import http from 'http';
import { startServer as startDevServer, createConfiguration } from 'snowpack';
import URL from 'url';
import path from 'path';

import fetch from 'node-fetch';
import clientConfig from './snowpack.client.config';
import httpProxy from 'http-proxy';

const {
  DEV_CLIENT_PORT = 4003,
  DEV_SERVER_PORT = 4002
} = process.env;

const serverProxy = httpProxy.createProxy({
  forward: `http://localhost:${DEV_SERVER_PORT}`,
});

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
  // routes: [
  //   {match: 'routes', src: '.*', async dest(req, res) {
  //     console.log('proxy', req.url, req.headers);

  //     // serverProxy.once('proxyRes', async (proxyRes, req, res) => {
  //     //   console.log('proxy res', proxyRes.statusCode, proxyRes.headers)

  //     //   const bodyText = await readBody(proxyRes);

  //     //   Object.entries(proxyRes.headers)
  //     //     .filter(([key]) => key !== 'content-length')
  //     //     .forEach(([key, value]) => res.setHeader(key, value));
  //     //   const contentType = proxyRes.headers['content-type'];

  //     //   if (contentType.includes('html')) {
  //     //     const r = await snowpack.loadUrl('/index.html')
  //     //     res.writeHead(proxyRes.statusCode, proxyRes.statusMessage);
  //     //     res.end(r.contents.toString().replace('__RENDERED_ELEMENT__', bodyText));
  //     //   } else {
  //     //     res.writeHead(proxyRes.statusCode, proxyRes.statusMessage);
  //     //     res.end(bodyText);
  //     //   }
  //     // })
  //     serverProxy.web(req, res, {selfHandleResponse: false});
  //   }}
  // ]
});

// console.log('CONFIG', snowpackConfig);
const snowpack = await startDevServer({
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