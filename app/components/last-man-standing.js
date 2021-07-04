import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LastManStandingComponent extends Component {
  @service store;
  @service game;
  @tracked currentGameweek = this.game.currentGameweek;

  @action
  setGameweek(event) {
    let gameweekId = event.target.value;
    this.currentGameweek = this.store.peekRecord('gameweek', gameweekId);
  }
}
