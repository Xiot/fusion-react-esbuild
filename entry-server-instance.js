import appImport from './snowpack/server2/main.cjs';
import http from 'http';
import fetch from 'node-fetch';
import {createPlugin, SSRBodyTemplateToken} from 'fusion-core';

const {
  DEV_CLIENT_PORT = 4003,
  DEV_SERVER_PORT = 4002,
  DEV_SNOWPACK_PORT = 4001
} = process.env;

const app = appImport.default();

const ssrPlugin = createPlugin({
  deps: {},
  provides() {
    return async ctx => {
      console.log('SSR');
      // const result = await pack.loadUrl(ctx.url);
      const response = await fetch(`http://localhost:${DEV_SNOWPACK_PORT}/index.html`);
      const contents = await response.text();
      const body = contents.replace('__RENDERED_ELEMENT__', ctx.rendered)
      // console.log(body)
      return body;
    }
  }
})
app.register(SSRBodyTemplateToken, ssrPlugin);

const handler = app.callback();

http.createServer((req, res) => {
  handler(req,res);
}).listen(DEV_SERVER_PORT, () => console.log('server', DEV_SERVER_PORT))