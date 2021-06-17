import Model, { attr, hasMany } from '@ember-data/model';

export default class GameweekModel extends Model {
  @attr('number') label;
  @hasMany('fixture') fixtures;
}
