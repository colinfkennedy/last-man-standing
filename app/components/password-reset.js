import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PasswordResetComponent extends Component {
  @tracked email;
  @tracked errorMessage;
  @tracked confirmationMessage;

  @action
  resetPassword() {
    console.log(`Resetting for ${this.email}`);
    Parse.User.requestPasswordReset(this.email)
      .then(() => {
        this.confirmationMessage = 'Sent reset email';
      })
      .catch((error) => {
        this.errorMessage = error.message;
        console.error(`Error: ${error.code} ${error.message}`);
      });
  }
}
