import { Sandbox } from './sandbox';
import * as io from 'socket.io-client';

const emptyPacket = ['empty', ''];

export class Network {
  sandbox: Sandbox;
  socket: any;

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;
  }

  connect() {
    this.socket = io('http://localhost:3000');
    
    this.socket.on('pong', (latencyInMs: any) => this.sandbox.mediator.publish('server:latency', latencyInMs));
    this.socket.onevent = (packet: any) => this.broadcastServerMessage(packet);

    this.sandbox.mediator.subscribe('movement-was-made', this, this.sendPlayerMovement);
  }

  sendPlayerMovement(position: any) {
    this.send('movement-was-made', position);
  }

  send(eventName: string, message: any): void {
    this.socket.emit(eventName, message);
  }

  broadcastServerMessage(packet: any): void {
    this.sandbox.mediator.publish(`server:${this.getServerPacket(packet).message}`, this.getServerPacket(packet).data);
  }

  getServerPacket(packet: any): any {
    return {
      message: (packet.data || emptyPacket)[0],
      data: (packet.data || emptyPacket)[1]
    };
  }
}
