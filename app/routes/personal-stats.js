import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class PersonalStatsRoute extends Route {
  @service store;

  model() {
    return RSVP.hash({
      babbers: this.store.findAll('babber'),
      games: this.store.findAll('game'),
      selections: this.store.findAll('selection'),
    });
  }
}

