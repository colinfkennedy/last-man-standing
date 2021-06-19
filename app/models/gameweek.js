import Model, { attr, hasMany } from '@ember-data/model';

export default class GameweekModel extends Model {
  @attr('string') label;
  @hasMany('fixture') fixtures;
  @hasMany('selection') selections;
}
