import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class LastManStandingComponent extends Component {
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
}
