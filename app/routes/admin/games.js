import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class AdminGamesRoute extends Route {
  @service store;

  model() {
    return RSVP.hash({
      babbers: this.store.findAll('babber'),
      gameweeks: this.store.findAll('gameweek'),
      games: this.store.findAll('game'),
    });
  }
}
