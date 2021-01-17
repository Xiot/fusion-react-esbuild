import http from 'http';
import {createPlugin, SSRBodyTemplateToken} from 'fusion-core';

const [,,mainPath] = process.argv;
const appImport = require(mainPath).default;

const {
  DEV_CLIENT_PORT = 4003,
  DEV_SERVER_PORT = 4002,
  DEV_SNOWPACK_PORT = 4001
} = process.env;

const app = appImport();

const ssrPlugin = createPlugin({
  deps: {},
  provides() {
    return ctx => {
      console.log('SSR');
      return ctx.rendered;
    }
  }
})
app.register(SSRBodyTemplateToken, ssrPlugin);

const handler = app.callback();

http.createServer((req, res) => {
  const startTime = Date.now();
  res.on('finish', () => {
    console.log(`[${pad(Date.now() - startTime)}] ${res.statusCode} - ${req.method} ${req.url}`)
  });
  handler(req,res);
}).listen(DEV_SERVER_PORT, () => {
  console.log('server', DEV_SERVER_PORT)
  process.send('server:ready');
});

function pad(value) {
  return String(value).padStart(4);
}