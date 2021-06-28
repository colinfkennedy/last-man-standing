import Model, { attr, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class BabberModel extends Model {
  @service store;
  @attr('string') name;
  @attr('string') photo;
  @hasMany('selection') selections;

  selection(gameweek) {
    let gameweekSelection = this.selections.findBy('gameweek.id', gameweek.id);

    return gameweekSelection || this.defaultSelection;
  }

  get defaultSelection() {
    let clubs = this.store.peekAll('club');
    let alreadySelected = this.selections.map((selection) =>
      selection.get('club.name')
    );

    return clubs
      .filter((club) => !alreadySelected.includes(club.name))
      .sortBy('name').firstObject;
  }
}
