import Model, { attr } from '@ember-data/model';

export default class ClubModel extends Model {
  @attr('string') name;
  @attr('string') logo;
}
