import { IContext } from './types';
import RantaAdapter from './index';

interface IGlobalThis {
  ctx: IContext;
}

const ranta = new RantaAdapter({
  debug: true,
  extensions: [
    {
      name: 'extA',
      data: {
        xs: 1,
        op: 1,
      },
    },
    {
      name: 'extB',
      data: {
        csd: 1,
        dda: 1,
      },
    },
  ],
});

const globalThis = {} as IGlobalThis;

ranta.bindCtx(globalThis, { test: 'qq' });

/* istanbul ignore next */
(async () => {
  globalThis.ctx.watch('xs', (value: any, oldValue: any) => {
    console.log('setting:', value, oldValue);
  });

  globalThis.ctx.data.xs = 'help';
  console.log(globalThis.ctx.data.xs);
  globalThis.ctx.data.xs = 'ok';
  console.log(globalThis.ctx.data.xs);

  globalThis.ctx.data.csd = {
    x: 123,
  };
  console.log(globalThis.ctx.data.csd);

  globalThis.ctx.data.csd.x = '323';
  console.log(globalThis.ctx.data.csd);

  globalThis.ctx.event.listen('test', (ev: any) => {
    console.log(ev);
  });
  globalThis.ctx.event.emit('test', Math.random());

  globalThis.ctx.process.define('dfn', (ev: any) => {
    console.log(ev);
  });
  globalThis.ctx.process.invoke('dfn', Math.random());
})();
