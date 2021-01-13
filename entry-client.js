import http from 'http';
import { startServer as startDevServer, createConfiguration } from 'snowpack';
import URL from 'url';
import path from 'path';

import fetch from 'node-fetch';
import clientConfig from './snowpack.client.config.cjs';
import httpProxy from 'http-proxy';

const {
  DEV_CLIENT_PORT = 4003,
  DEV_SERVER_PORT = 4002
} = process.env;


const norm = createConfiguration(clientConfig);
console.log(norm);
const snowpack = await startDevServer({
  config: norm,
  cwd: '/Users/tchrs@uber.com/dev/github/xiot/fusion-react-esbuild/src',
});

const serverProxy = httpProxy.createProxy({
  target: `http://localhost:${DEV_SERVER_PORT}`
});

// serverProxy.on('proxyRes', (proxyRes, req, res) => {
//   proxyRes.on('data', data => console.log(data.toString()))
// })

const shouldHandle = pathname => {
  const ext = path.extname(pathname);
  return !!ext;
}

const httpServer = http.createServer(async (req, res) => {
  const url = URL.parse(req.url);
  const {pathname} = url;

  console.log(pathname);
  if (req.protocol === 'ws') {
    snowpack.handleRequest(req, res);
    return;
  }

  if (shouldHandle(pathname)) {
    snowpack.handleRequest(req, res)
    // const buildResult = await snowpack.loadUrl(req.url).catch(ex => console.log('ERROR', ex));
    // res.writeHead(200, {
    //   'content-type': buildResult.contentType
    // })
    // res.write(buildResult.contents);
    // res.end();
    return;
  }

  // detect if server is restarting and wait until it comes back to send the request.
  serverProxy.web(req, res);
}).listen(DEV_CLIENT_PORT, () => console.log('client listening', DEV_CLIENT_PORT))