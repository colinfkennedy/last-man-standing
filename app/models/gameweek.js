import Model, { attr, hasMany } from '@ember-data/model';

export default class GameweekModel extends Model {
  @attr('number') number;
  @hasMany('fixture') fixtures;
}
