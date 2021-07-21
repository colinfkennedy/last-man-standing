import Model, { attr, hasMany } from '@ember-data/model';

export default class BabberModel extends Model {
  @attr('string') name;
  @attr('string') email;
  @attr('string') photo;
  @hasMany('selection') selections;
}
