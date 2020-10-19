import { Sandbox } from './sandbox';
import { Controllers } from './controllers';
import { Game } from './game';
import { Player } from './player';
import { OtherPlayer } from './otherPlayer';
import { Tree } from './tree';
import { Latency } from './latency';

const sandbox = new Sandbox();

new Player(sandbox);
new Latency(sandbox);
new Game(sandbox).configure().start();

sandbox.network.connect();

sandbox.mediator.subscribe('server:map', this, (mapInfo: any) => {
  mapInfo.a.forEach((info: any) => new Tree(sandbox, info, mapInfo));
});

sandbox.mediator.subscribe('server:map-players', this, (othersPlayers: any) => {
  othersPlayers.forEach((otherPlayerInfo: any) => {
    new OtherPlayer(sandbox, otherPlayerInfo);
  });
});

sandbox.mediator.subscribe('server:new-player-joined', this, (otherPlayer: any) => {
    new OtherPlayer(sandbox, otherPlayer);
});

sandbox.mediator.subscribe('server:player-disconnected', this, (otherPlayerInfo: any) => {
  sandbox.mediator.publish('other-player-disconnected', otherPlayerInfo);
});

sandbox.mediator.subscribe('server:player-moved', this, (otherPlayer: any) => {
  sandbox.mediator.publish('other-player-moved', otherPlayer);
});
