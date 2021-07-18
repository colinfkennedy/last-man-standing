import Model, { attr, belongsTo } from '@ember-data/model';
import { cached } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';

export default class SelectionModel extends Model {
  @belongsTo('gameweek') gameweek;
  @belongsTo('babber') babber;
  @belongsTo('club') club;
  @attr('boolean', { defaultValue: false }) isAlphabetPick;

  @cached
  get lost() {
    if (isPresent(this.club.get('name'))) {
      return isPresent(
        this.gameweek.get('losingTeams').findBy('name', this.club.get('name'))
      );
    } else {
      return false;
    }
  }
}
