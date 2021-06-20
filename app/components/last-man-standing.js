import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LastManStandingComponent extends Component {
  @tracked currentGameweek = this.args.gameweeks.firstObject;
  @service store;

  @action
  setGameweek(event) {
    let gameweekId = event.target.value;
    console.log('Gameweek selected', gameweekId);
    this.currentGameweek = this.store.peekRecord('gameweek', gameweekId);
  }
}
