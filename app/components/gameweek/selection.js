import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GameweekSelectionComponent extends Component {
  @service game;
  @service store;

  @action
  saveSelection(event) {
    let club = this.store.peekRecord('club', event.target.value);
    console.log(`Save selection ${club.name}`);
    let currentSelection = this.args.selection;
    if (currentSelection.isAlphabetPick) {
      let newSelection = this.store.createRecord('selection');
      newSelection.babber = currentSelection.babber;
      newSelection.club = club;
      newSelection.gameweek = currentSelection.gameweek;
    } else {
      currentSelection.club = club;
    }
  }

  get gameweekStarted() {
    return new Date('August 13, 2021 20:00:00') >= this.args.selection.get('gameweek.start');
  }

  get eligibleTeams() {
    let { gameweek, babber } = this.args.selection;

    return this.game.clubsForGameweek(gameweek, babber);
  }
}
