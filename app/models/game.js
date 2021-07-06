import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class GameModel extends Model {
  @service store;
  @attr('string') label;
  @belongsTo('babber') winner;
  @belongsTo('gameweek', { inverse: null }) startGameweek;
  @belongsTo('gameweek', { inverse: null }) endGameweek;

  get gameweeks() {
    return this.store
      .peekAll('gameweek')
      .filter((gameweekRecord) => {
        return (
          parseInt(gameweekRecord.label) >=
            parseInt(this.startGameweek.get('label')) &&
          parseInt(gameweekRecord.label) <=
            parseInt(this.endGameweek.get('label'))
        );
      })
      .sortBy('start');
  }

  hasGameweek(gameweek) {
    let gameweekId = parseInt(gameweek.label);

    return (
      gameweekId >= parseInt(this.startGameweek.get('label')) &&
      gameweekId <= parseInt(this.endGameweek.get('label'))
    );
  }
}
