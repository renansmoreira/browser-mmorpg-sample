import { Sandbox } from './sandbox';

export class Latency {
  sandbox: Sandbox;
  latencyInMs: number = 0;

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;

    this.sandbox.mediator.subscribe('server:latency', this, this.updateLatency);
    this.sandbox.mediator.subscribe('update', this, this.update);
  }

  updateLatency(latencyInMs: number): void {
    this.latencyInMs = latencyInMs;
  }

  update(context: CanvasRenderingContext2D): void {
    context.font = '15px arial';
    context.fillText(`Latency: ${this.latencyInMs}ms`, 10, 20);
  }
}
