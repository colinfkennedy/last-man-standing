/*global Parse*/
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class AdminBabberComponent extends Component {
  @action
  resetPassword() {
    let email = this.args.babber.get('email');
    console.log(`Resetting for ${email}`);
    Parse.User.requestPasswordReset(email)
      .then(() => {
        console.log('Sent reset email');
      })
      .catch((error) => {
        console.error(`Error: ${error.code} ${error.message}`);
      });
  }
}
