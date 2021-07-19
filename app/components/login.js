import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class LoginComponent extends Component {
  @service router;
  @service game;
  @tracked username;
  @tracked password;
  @tracked errorMessage;

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
      this.router.transitionTo('index');
    } catch (e) {
      this.errorMessage = e.message;
    }
  }
}
