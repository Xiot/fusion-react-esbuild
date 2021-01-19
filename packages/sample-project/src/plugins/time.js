import {createPlugin, createToken} from 'fusion-core';

export const TimeToken = createToken('time');
export const TimePlugin = createPlugin({
  middleware() {
    return (ctx, next) => {
      if (ctx.method === 'GET' && ctx.path === '/time') {
        ctx.body = {time: 'TIME ' +  Date.now()};
      }
      return next();
    };
  }
})