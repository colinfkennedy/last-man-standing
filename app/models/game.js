import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class GameModel extends Model {
  @service store;
  @attr('string') label;
  @belongsTo('babber') winner;
  @hasMany('gameweek') gameweeks;

  get currentGameweek() {
    let now = new Date();
    return this.store.peekAll('gameweek').find((gameweek) => {
      return now.setHours(1) < gameweek.end;
    });
  }
}
