import Route from '@ember/routing/route';

export default class AdminRoute extends Route {
  beforeModel() {
    let currentUser = Parse.User.current();
    if (currentUser.id !== 'XiIbeWrSJD') {
      this.transitionTo('index');
    }
  }
}
