/* eslint-disable @typescript-eslint/no-redeclare */
import { IContext } from './types';

interface IDefConfig {
  [key: string]: Function;
}

interface IProcessHelperConfig {
  interrupt?: boolean;
}

export const mapData = (keys: string[] | IDefConfig, ctx: IContext, ctxBind: any) => {
  if (!keys) {
    return [];
  }
  if (!ctxBind._$unmapFns) {
    ctxBind._$unmapFns = [] as Function[];
  }
  if (Array.isArray(keys)) {
    keys.forEach((key) => {
      // ctxBind为外部上下文
      ctxBind._$unmapFns.push(
        ctx.watch(key, (val: any) => {
          ctxBind[key] = val;
        }),
      );
    });
  } else {
    Object.keys(keys).forEach((key) => {
      ctxBind._$unmapFns.push(
        ctx.watch(key, (val: any) => {
          ctxBind[key] = keys[key](val);
        }),
      );
    });
  }
  return ctxBind._$unmapFns;
};

export const mapEvent = (options: IDefConfig, ctx: IContext, ctxBind: any) => {
  if (!ctxBind._$unmapFns) {
    ctxBind._$unmapFns = [] as Function[];
  }
  Object.keys(options).forEach((key) => {
    const fn = options[key];
    if (fn instanceof Function) {
      ctx.event.listen(key, fn);
      ctxBind._$unmapFns.push(
        () => {
          ctx.event.remove(key, fn);
        },
      );
    }
  });
  return ctxBind._$unmapFns;
};

export const mapProcess = (options: IDefConfig, ctx: IContext) => {
  Object.keys(options).forEach((key) => {
    const fn = options[key];
    if (fn instanceof Function) {
      ctx.process.define(key, fn);
    }
  });
};

export const runProcess = (keys: string[], ctx: IContext, options: IProcessHelperConfig = {}) => {
  let promise = Promise.resolve();
  keys.forEach((key: string) => {
    promise = promise.then((val: any) => {
      if (options && options.interrupt) {
        return Promise.reject('process manually interrupted');
      }
      const result = ctx.process.invoke(key, val);
      if (result instanceof Promise) {
        return result;
      }
      return Promise.resolve(result);
    })
  });
  return promise;
}

export const unmapActions = (ctxBind: any) => {
  if (!ctxBind || !ctxBind._$unmapFns) {
    return;
  }
  while (ctxBind._$unmapFns.length > 0) {
    const unmapFn = ctxBind._$unmapFns.pop();
    unmapFn && unmapFn();
  }
};
