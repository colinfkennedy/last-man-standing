/*global Parse*/
import Route from '@ember/routing/route';

export default class LoginRoute extends Route {
  beforeModel() {
    let currentUser = Parse.User.current();
    if (currentUser) {
      this.transitionTo('index');
    }
  }
}
