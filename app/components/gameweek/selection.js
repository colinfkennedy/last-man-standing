import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { cached, tracked } from '@glimmer/tracking';
import Model from '@ember-data/model';
export default class GameweekSelectionComponent extends Component {
  @service game;
  @service store;
  @tracked confirmMessage;

  @action
  saveSelectionOnSelect(event) {
    let club = this.store.peekRecord('club', event.target.value);
    this.saveSelection(club);
  }

  @action
  saveCurrentSelection() {
    console.log('Saving current selection');
    this.saveSelection(this.args.selection.club);
  }

  saveSelection(club) {
    let currentSelection = this.args.selection;
    if (currentSelection instanceof Model) {
      currentSelection.club = club;
      this.persistSelection.perform(currentSelection);
    } else {
      let newSelection = this.store.createRecord('selection');
      newSelection.babber = currentSelection.babber;
      newSelection.club = club;
      newSelection.gameweek = currentSelection.gameweek;
      this.persistSelection.perform(newSelection);
    }
  }

  @task
  *persistSelection(selection) {
    if (this.args.adminMode) {
      selection.isAlphabetPick = true;
    }
    let savedSelection = yield selection.save();
    if (this.args.adminMode && !savedSelection.isError) {
      this.confirmMessage = 'Selection saved';
    }
  }

  @cached
  get selectionDisabled() {
    if (this.args.adminMode) {
      return false;
    } else {
      return new Date() >= this.args.selection.get('gameweek.start');
    }
  }

  @cached
  get eligibleTeams() {
    let { gameweek, babber } = this.args.selection;

    return this.game.clubsForGameweek(gameweek, babber);
  }

  get canEditSelection() {
    return (
      this.game.currentUser.id === this.args.selection.get('babber.id') ||
      this.args.adminMode
    );
  }
}
