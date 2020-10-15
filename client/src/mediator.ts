import { Sandbox } from './sandbox';
class Event {
  name: string;
  thisContext: object;
  handler: Function;

  constructor(name: string, thisContext: object, handler: Function) {
    this.name = name;
    this.thisContext = thisContext;
    this.handler = handler;
  }

  execute(...data: any[]): void {
    this.handler.apply(this.thisContext, ...data);
  }
}

export class Mediator {
  sandbox: Sandbox;
  events: Record<string, Event[]> = {};

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;
  }

  subscribe(eventName: string, thisContext: object, handler: Function): void {
    const handlers = this.events[eventName] || [];
    handlers.push(new Event(eventName, thisContext, handler));
    this.events[eventName] = handlers;
  }

  unsubscribe(thisContext: object): void {
    for (let eventName in this.events) {
      this.events[eventName] = this.events[eventName]
        .filter((event: Event) => event.thisContext !== thisContext);
    }
  }

  publish(eventName: string, ...data: any[]): void {
    (this.events[eventName] || [])
      .forEach(event => event.execute(data));
  }
}
