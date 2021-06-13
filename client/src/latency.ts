import { Sandbox } from './sandbox';
import { Screen } from './screen';

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

  update(screen: Screen): void {
    screen.font('15px arial');
    screen.fontColor('blue');
    screen.fillText(`Latency: ${this.latencyInMs}ms`, screen.width - 120, 20);
  }
}
