import Component from '@glimmer/component';
import { action } from '@ember/object';
import { cached, tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class LastManStandingComponent extends Component {
  @service store;
  @service router;
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

  @action
  logout() {
    this.performLogout.perform();
  }

  @task
  *performLogout() {
    yield Parse.User.logOut();
    this.router.transitionTo('login');
  }
}
