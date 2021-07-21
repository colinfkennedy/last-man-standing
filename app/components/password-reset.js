import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PasswordResetComponent extends Component {
  @tracked email;
  @tracked message;

  @action
  resetPassword() {
    console.log(`Resetting for ${this.email}`);
    Parse.User.requestPasswordReset(this.email)
      .then(() => {
        this.message = 'Sent reset email';
      })
      .catch((error) => {
        this.message = error.message;
        console.error(`Error: ${error.code} ${error.message}`);
      });
  }
}
