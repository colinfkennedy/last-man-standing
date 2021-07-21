import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class AdminBabbersRoute extends Route {
  @service store;

  model() {
    return RSVP.hash({
      babbers: this.store.findAll('babber'),
    });
  }
}
