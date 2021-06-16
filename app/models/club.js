import Model, { attr, hasMany } from '@ember-data/model';

export default class ClubModel extends Model {
  @attr('string') name;
  @attr('string') logo;
  @hasMany('fixture') fixtures;
}
