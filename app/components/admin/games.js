import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AdminGamesComponent extends Component {
  @service store;

  @action
  createGame() {
    this.store.createRecord('game');
  }
}
