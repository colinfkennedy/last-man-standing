import Model, { belongsTo } from '@ember-data/model';

export default class SelectionModel extends Model {
  @belongsTo('gameweek') gameweek;
  @belongsTo('babber') babber;
  @belongsTo('club') club;
}
