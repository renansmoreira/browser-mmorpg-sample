import Player from '../models/player';
import Plot from '../models/plot';

export default class MapCollection {
  get(mapName: string): Promise<Plot> {
    const executor = (resolve, reject) => {
      const plot: Plot = new Plot(mapName);

      if (mapName === 'first-map') {
        plot.setEnvironmentObjects([
          { t: 't', x: 5, y: 23 },
          { t: 't', x: 149, y: 212 },
          { t: 't', x: 50, y: 95 },
          { t: 't', x: 123, y: 250 },
          { t: 't', x: 400, y: 20 },
          { t: 't', x: 280, y: 300 },
          { t: 't', x: 319, y: 400 }
        ]);
      }

      resolve(plot);
    };

    return new Promise<Plot>(executor);
  }
}
