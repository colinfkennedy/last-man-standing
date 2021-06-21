import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AdminFixturesRoute extends Route {
  @service store;

  model() {
    return {
      gameweeks: this.store.findAll('gameweek'),
    };
  }
}
