import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GameweekSelectionComponent extends Component {
  @service game;
  selector;

  @action
  saveSelection() {
    console.log('Save selection');
  }

  @action
  storeSelector(element) {
    this.selector = element;
  }

  get eligibleTeams() {
    let { gameweek, babber } = this.args.selection;

    return this.game.clubsForGameweek(gameweek, babber);
  }
}
