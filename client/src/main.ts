import { Sandbox } from './sandbox';
import { Controllers } from './controllers';
import { Game } from './game';
import { Player } from './player';
import { Tree } from './tree';
import { Latency } from './latency';

const sandbox = new Sandbox();
sandbox.network.connect();
new Controllers(sandbox).configureListener();
new Game(sandbox).configure().start();
new Player(sandbox);
new Latency(sandbox);

const players: Record<string, any> = {};

sandbox.mediator.subscribe('server:map-players', this, (othersPlayers: any) => {
  othersPlayers.forEach((otherPlayer: any) => {
    players[otherPlayer.id] = new Player(sandbox, otherPlayer, true);
  });
});

sandbox.mediator.subscribe('server:new-player-joined', this, (otherPlayer: any) => {
  if (!players[otherPlayer.id]) {
    players[otherPlayer.id] = new Player(sandbox, otherPlayer, true);
  }
});

sandbox.mediator.subscribe('server:player-disconnected', this, (otherPlayer: any) => {
  players[otherPlayer.id].remove();
  delete players[otherPlayer.id];
});

sandbox.mediator.subscribe('server:player-moved', this, (otherPlayer: any) => {
  players[otherPlayer.id].changePosition(otherPlayer.position);
});

new Tree(sandbox, { x: 100, y: 200 });
new Tree(sandbox, { x: 300, y: 100 });
new Tree(sandbox, { x: 200, y: 400 });
new Tree(sandbox, { x: 430, y: 410 });
new Tree(sandbox, { x: 30, y: 40 });
