/*global Parse*/
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

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

  @action
  // eslint-disable-next-line no-unused-vars
  error(error, transition) {
    //TODO Make it specific to the Parse.Error.INVALID_SESSION_TOKEN
    if (error.code === 'AdapterError') {
      Parse.User.logOut();
      this.replaceWith('login');
    } else {
      // Let the route above this handle the error.
      console.error(`Error: `, error);
    }
  }
}
