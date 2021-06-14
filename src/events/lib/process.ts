import { IInnerOptions, IPureObject } from './types';
import Logger from './Logger';

interface IProcessor {
  key: string;
  handler: Function;
}

interface IProcessorArgsQueue {
  [key: string]: { args: any[] }[];
}

class Process {
  private _options: IInnerOptions;

  processors: Map<string, IProcessor>;

  private _processArgsQueue: IProcessorArgsQueue;

  constructor(options: IInnerOptions = {}) {
    this.processors = new Map();
    this._options = options;
    this._processArgsQueue = {};
  }

  define(key: string, handler: Function) {
    if (!key || !handler || !handler.apply) {
      /* istanbul ignore next */
      if (this._options.debug) {
        Logger.info(`ranta-adapter: process: lack of key or handler`);
      }
      return;
    }

    const processor = this.processors.get(key);

    if (processor) {
      /* istanbul ignore next */
      if (this._options.debug) {
        Logger.info(`ranta-adapter: process: ${key} had been defined`);
      }
      return;
    }

    this.processors.set(key, {
      key,
      handler,
    });

    if (this._processArgsQueue[key]) {
      while (this._processArgsQueue[key].length > 0) {
        const task = this._processArgsQueue[key].pop();
        task && this.invoke(key, ...task.args);
      }
      delete this._processArgsQueue[key];
    }
  }

  invoke(key: string, ...args: any[]) {
    const processor = this.processors.get(key);

    if (!processor) {
      if (!this._processArgsQueue[key]) {
        this._processArgsQueue[key] = [];
      }
      this._processArgsQueue[key].push({ args });
      return;
    }

    return processor.handler.apply(null, args);
  }
}

export default Process;
