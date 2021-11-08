import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

const updateFixturesUrl =
  'https://europe-west2-babb-last-man-standing.cloudfunctions.net/refreshFixtures';
export default class AdminFixturesComponent extends Component {
  @service store;
  @service game;
  @tracked currentGameweek = this.game.currentGameweek;

  @cached
  get gameweeks() {
    return this.store.peekAll('gameweek').sortBy('start');
  }

  @action
  setGameweek(event) {
    let gameweekId = event.target.value;
    this.currentGameweek = this.store.peekRecord('gameweek', gameweekId);
  }

  get updateFixturesUrl() {
    return updateFixturesUrl;
  }
}
