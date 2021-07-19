import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Application extends Route {
  @service game;

  beforeModel() {
    let currentUser = Parse.User.current();
    if (currentUser) {
      this.game.currentUser = currentUser;
    } else {
      //Redirect to login
      this.transitionTo('login');
    }
  }
}
