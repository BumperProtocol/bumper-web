import { IContext } from './types';

interface IEvent {
  id: number;
  once: boolean;
  ctx: IContext;
  callback: Function;
}

class Event {
  private _eventMap: Map<string, IEvent[]>;
  private _id: number;

  constructor() {
    this._eventMap = new Map();
    this._id = 0;
  }

  listen(name: string, callback: Function, ctx?: IContext) {
    return this.createEvent(
      {
        name,
        callback,
        once: false,
      },
      ctx,
    );
  }

  remove(name: string, callback?: Function) {
    if (!callback) {
      this._eventMap.delete(name);
    } else {
      const events = this._eventMap.get(name);
      if (events) {
        this._removeEventByFn(events, callback);
      }
    }
  }

  once(name: string, callback: Function, ctx?: IContext) {
    return this.createEvent(
      {
        name,
        callback,
        once: true,
      },
      ctx,
    );
  }

  emit(name: string, ...args: any[]) {
    const events = this._eventMap.get(name);

    if (!events) {
      return this;
    }

    events.forEach((event: IEvent) => {
      const { id, callback, once, ctx } = event;
      callback && callback.apply(ctx, args);
      if (once) {
        this._removeEventById(events, id);
      }
    });

    return this;
  }

  createEvent(options: { name: string; callback: Function; once?: boolean }, ctx?: IContext) {
    const { name, callback, once } = options;
    const events = this._eventMap.get(name) || [];
    const eventId = ++this._id;

    events.push({
      id: eventId,
      once,
      callback,
      ctx,
    } as IEvent);

    this._eventMap.set(name, events);

    return () => {
      /* istanbul ignore else */
      if (events) {
        this._removeEventById(events, eventId);
      }
    };
  }

  _removeEventById(events: IEvent[], id: number) {
    for (let i = 0; i < events.length; i++) {
      const item = events[i];
      if (item.id === id) {
        events.splice(i, 1);
        break;
      }
    }
  }

  _removeEventByFn(events: IEvent[], callback: Function) {
    for (let i = 0; i < events.length; i++) {
      const item = events[i];
      if (item.callback === callback) {
        events.splice(i, 1);
        break;
      }
    }
  }
}

export default Event;
