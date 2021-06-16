import Model, { attr, belongsTo } from '@ember-data/model';

export default class FixtureModel extends Model {
  @attr('date') date;
  @belongsTo('club', { inverse: null }) homeTeam;
  @belongsTo('club', { inverse: null }) awayTeam;
  @belongsTo('gameweek') gameweek;
}
