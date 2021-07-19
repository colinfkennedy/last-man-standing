import EmberRouter from '@ember/routing/router';
import config from 'last-man-standing/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('admin', function () {
    this.route('fixtures');
    this.route('games');
  });
  this.route('leaderboard');
  this.route('login');
});
