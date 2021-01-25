import { Sandbox } from './sandbox';
import { Controllers } from './controllers';
import { Game } from './game';
import { Player } from './player';
import { OtherPlayer } from './otherPlayer';
import { Tree } from './tree';
import { SpawnedMonster } from './spawnedMonster';
import { Latency } from './latency';

const sandbox = new Sandbox();

new Player(sandbox);
new Latency(sandbox);
new Game(sandbox).configure().start();

sandbox.network.connect();

// TODO: Fix issue with player-started event. Its emitting all the time in client, dunno why
// and its not emitted during server map, but works on nearby-environment

sandbox.mediator.subscribe('server:map', this, (mapInfo: any) => {
  const trees: Tree[] = mapInfo.a.map((treeInfo: any) => new Tree(sandbox, treeInfo));
  sandbox.gameState.trees = trees;
});

sandbox.mediator.subscribe('server:nearby-environment', this, (nearbyEnvironment: any) => {
  const spawnedMonsters: SpawnedMonster[] = nearbyEnvironment.spawnedMonsters
    .map((spawnedMonster: any) => new SpawnedMonster(sandbox, spawnedMonster));
  sandbox.gameState.spawnedMonsters = spawnedMonsters;
});

sandbox.mediator.subscribe('server:monster-attacked', this, (damageDealt: any) => {
  console.log(damageDealt);
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
