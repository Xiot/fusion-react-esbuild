import http from 'http';
import {createPlugin, SSRBodyTemplateToken, consumeSanitizedHTML, html} from 'fusion-core';
// import {SSRBodyTemplate} from 'fusion-cli/plugins/ssr-plugin';

const [,,mainPath] = process.argv;
const appImport = require(mainPath).default;

const {
  DEV_CLIENT_PORT = 4003,
  DEV_SERVER_PORT = 4002,
  DEV_SNOWPACK_PORT = 4001
} = process.env;

const app = appImport();
console.log(html.toString()); //`<div>${2}</div>`);
const ssrPlugin = createPlugin({
  deps: {},
  provides() {
    return ctx => {
      const {htmlAttrs, bodyAttrs, title, head, body} = ctx.template;
      console.log('SSR',
      htmlAttrs,
      bodyAttrs,
      title,
      head.map(x => consumeSanitizedHTML(x)).join(''),
      body.map(x => consumeSanitizedHTML(x)).join('')
      )
      // console.log('SSR', ctx.rendered);
      return "<html><body>" + body.map(x => consumeSanitizedHTML(x)).join('') + ctx.rendered + "</body></html>";
    }
  }
})
app.register(SSRBodyTemplateToken, ssrPlugin);
// app.register(SSRBodyTemplateToken, SSRBodyTemplate);

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