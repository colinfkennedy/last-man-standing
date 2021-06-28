import Component from '@glimmer/component';
import { isPresent } from '@ember/utils';
import { cached } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class GameweekSelectionComponent extends Component {
  @service store;

  get hasSelection() {
    return isPresent(this.selection);
  }

  get noSelection() {
    return !this.hasSelection;
  }

  @cached
  get selection() {
    return this.args.babber
      .get('selections')
      .findBy('gameweek.id', this.args.gameweek.get('id'));
  }

  get clubSelection() {
    return this.selection?.club || this.defaultSelection;
  }

  get defaultSelection() {
    let clubs = this.store.peekAll('club');
    let alreadySelected = this.args.babber.selections.map((selection) =>
      selection.get('club.name')
    );
    //TODO Fix this for games that don't start on gameweek 1.
    let previousAlphabetPicks =
      parseInt(this.args.gameweek.label) - 1 - alreadySelected.length;

    return clubs
      .filter((club) => !alreadySelected.includes(club.name))
      .sortBy('name')
      .slice(previousAlphabetPicks, 100).firstObject;
  }
}
