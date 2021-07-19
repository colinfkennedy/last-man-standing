import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class LoginComponent extends Component {
  @tracked username;
  @tracked password;
  @tracked errorMessage;
  @service game;

  @action
  login() {
    this.performLogin.perform();
  }

  @task
  *performLogin() {
    this.errorMessage = null;
    try {
      let user = yield Parse.User.logIn(this.username, this.password, {
        usePost: true,
      });

      this.game.setSessionToken(user.getSessionToken());
    } catch (e) {
      this.errorMessage = e.message;
    }
  }

  @action
  logout() {
    this.performLogout.perform();
  }

  @task
  *performLogout() {
    this.errorMessage = null;
    yield Parse.User.logOut();
    this.errorMessage = 'Logged out';
  }
}
