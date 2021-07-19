import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class LogoutButtonComponent extends Component {
  @service router;
  @service game;

  @action
  logout() {
    this.performLogout.perform();
  }

  @task
  *performLogout() {
    yield Parse.User.logOut();
    this.game.currentUser = Parse.User.current();
    this.router.transitionTo('login');
  }
}
