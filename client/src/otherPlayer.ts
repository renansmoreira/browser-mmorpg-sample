import { Sandbox, Screen } from './sandbox';

export class OtherPlayer {
  sandbox: Sandbox;
  id: string;
  name: string;
  width: number;
  heigth: number;
  x: number;
  displayX: number;
  y: number;
  displayY: number;
  color: string;

  constructor(sandbox: Sandbox, playerInfo: any) {
    this.sandbox = sandbox;
    this.id = playerInfo.id;
    this.name = new Date().getTime().toString();
    this.width = this.heigth = 10;
    this.color = 'red';
    this.x = playerInfo.position.x;
    this.y = playerInfo.position.y;

    this.sandbox.mediator.subscribe('other-player-moved', this, this.changePosition);
    this.sandbox.mediator.subscribe('other-player-disconnected', this, this.disconnect);
    this.sandbox.mediator.subscribe('movement-was-made', this, this.changePositionBasedOnLocalPlayer);
    this.sandbox.mediator.subscribe('update', this, this.update);
  }

  disconnect(playerInfo: any): void {
    if (playerInfo.id !== this.id) {
      return;
    }

    this.sandbox.mediator.unsubscribe(this);
  }

  changePosition(playerInfo: any): void {
    if (playerInfo.id !== this.id) {
      return;
    }

    this.x = playerInfo.position.x;
    this.y = playerInfo.position.y;
    this.changePositionBasedOnLocalPlayer(this.sandbox.gameState.currentLocalPlayerPosition);
  }

  changePositionBasedOnLocalPlayer(localPlayerCurrentPosition: any): void {
    this.displayX = this.x - this.sandbox.gameState.currentLocalPlayerPosition.x + this.sandbox.screen.displayX;
    this.displayY = this.y - this.sandbox.gameState.currentLocalPlayerPosition.y + this.sandbox.screen.displayY;
  }

  update(screen: Screen): void {
    screen.fillStyle(this.color);
    screen.fillRect(this.displayX, this.displayY, this.width, this.heigth);
  }
}
