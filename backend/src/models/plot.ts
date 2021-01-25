import Player from './player';
import Position from './position';

export default class Plot {
  environmentObjects: any[];

  constructor(name: string) {
    this.name = name;
  }

  setEnvironmentObjects(environmentObjects: any[]): void {
    this.environmentObjects = environmentObjects;
  }

  getClientDefinition(): any {
    return {
      a: this.environmentObjects
    };
  }
}
