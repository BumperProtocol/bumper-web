import { IContext } from './types';
import Logger from './Logger';

type INotifyTimes = {
  [key in string | number]: number;
};

interface INoticeHandler {
  id: number;
  handler: Function;
}

interface IWatcher {
  key: string | number;
  unWatch: Function;
  noticeHandler: Map<number, INoticeHandler>;
}

class Watcher {
  watchers: Map<string | number, IWatcher>;
  private __notifyTimes: INotifyTimes;
  private _id: number;

  constructor() {
    this.watchers = new Map();
    this.__notifyTimes = {};
    this._id = 0;
  }

  watch(key: string | number, callback: Function, ctx: IContext) {
    if (!key || !callback) {
      Logger.info('ranta-adapter: watch: 缺少 watch name 或者 回调函数 callback');
      return;
    }

    if (this.__notifyTimes[key] > 0) {
      callback.call(ctx, ctx.data[key]);
    }

    const handlerId = ++this._id;

    const watcher = this.watchers.get(key) || {
      key,
      unWatch: /* istanbul ignore next */ () => {
        this._unWatchAll(key);
      },
      noticeHandler: new Map(),
    };
    watcher.noticeHandler.set(handlerId, {
      id: handlerId,
      handler: callback,
    });
    this.watchers.set(key, watcher);
    return this._unWatch(key, handlerId);
  }

  /* istanbul ignore next */
  unWatch(key: string | number) {
    this._unWatchAll(key);
  }

  _unWatch(key: string | number, id: number) {
    return () => {
      const watcher = this.watchers.get(key);
      /* istanbul ignore else */
      if (watcher) {
        watcher.noticeHandler.delete(id);
      }
    };
  }

  /* istanbul ignore next */
  _unWatchAll(key: string | number) {
    const watcher = this.watchers.get(key);
    if (watcher) {
      watcher.noticeHandler.clear();
      watcher.unWatch = () => {};
      this.watchers.set(key, watcher);
    }
    this.watchers.delete(key);
  }

  notify(key: string | number, args: any[], ctx: IContext) {
    if (this.__notifyTimes[key] === undefined) {
      this.__notifyTimes[key] = 1;
    } else {
      this.__notifyTimes[key] += 1;
    }
    const watcher = this.watchers.get(key);
    if (!watcher) {
      return;
    }
    watcher.noticeHandler.forEach((handlerObj) => {
      const { handler } = handlerObj;
      handler.apply(ctx, args);
    });
  }
}

export default Watcher;
