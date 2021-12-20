import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { cached } from '@glimmer/tracking';

export default class GameweekSelectionComponent extends Component {
  @service game;
  @service store;

  @action
  changeDefaultSelection(select) {
    let club = this.store.peekRecord('club', select.value);
    let currentSelection = this.args.selection;
    this.updateDefaultSelection(currentSelection, club);
  }

  @action
  saveSelection(event) {
    let club = this.store.peekRecord('club', event.target.value);
    let currentSelection = this.args.selection;
    if (currentSelection.isAlphabetPick) {
      // this.updateDefaultSelection(currentSelection, club);
      let newSelection = this.store.createRecord('selection');
      newSelection.babber = currentSelection.babber;
      newSelection.club = club;
      newSelection.gameweek = currentSelection.gameweek;
      this.persistSelection.perform(newSelection);
    } else {
      currentSelection.club = club;
      this.persistSelection.perform(currentSelection);
    }
  }

  updateDefaultSelection(currentSelection, club) {
    if (currentSelection.isAlphabetPick) {
      let newSelection = this.store.createRecord('selection');
      newSelection.babber = currentSelection.babber;
      newSelection.club = club;
      newSelection.gameweek = currentSelection.gameweek;
      this.persistSelection.perform(newSelection);
    }
  }

  @cached
  get currentSelectionNotEligible() {
    return (
      !this.gameweekStarted &&
      !this.eligibleTeams
        .map((team) => team.get('name'))
        .includes(this.args.selection.get('club.name'))
    );
  }

  @task
  *persistSelection(selection) {
    yield selection.save();
  }

  @cached
  get gameweekStarted() {
    return new Date() >= this.args.selection.get('gameweek.start');
  }

  @cached
  get eligibleTeams() {
    let { gameweek, babber } = this.args.selection;

    return this.game.clubsForGameweek(gameweek, babber);
  }

  get isCurrentUser() {
    return this.game.currentUser.id === this.args.selection.get('babber.id');
  }
}
