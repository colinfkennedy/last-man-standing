import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LastManStandingRoute extends Route {
  @service store;

  model() {
    this.store.createRecord('club', {
      name: 'Manchester United',
      logo: 'manchester-united',
    });

    return {
      clubs: this.store.peekAll('club'),
    };
  }
}
