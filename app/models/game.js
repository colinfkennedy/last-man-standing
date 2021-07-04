import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class GameModel extends Model {
  @service store;
  @attr('string') label;
  @belongsTo('babber') winner;
  @belongsTo('gameweek', { inverse: null}) startGameweek;
  @belongsTo('gameweek', { inverse: null }) endGameweek;
  @hasMany('gameweek') gameweeks;
}
