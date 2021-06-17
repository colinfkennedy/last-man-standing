import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LastManStandingComponent extends Component {
  @tracked currentGameweek = this.args.gameweeks.firstObject;
  @service store;

  @task
  *saveManUnited() {
    const manUnitedClub = new Parse.Object('Club');
    manUnitedClub.set('name', 'Manchester United');
    manUnitedClub.set('logo', 'man_united.jpg');
    yield manUnitedClub.save();
  }

  @action
  addManUnited() {
    this.saveManUnited.perform();
  }

  @action
  setGameweek(event) {
    let gameweekId = event.target.value;
    console.log('Gameweek selected', gameweekId);
    this.currentGameweek = this.store.peekRecord('gameweek', gameweekId);
  }
}
