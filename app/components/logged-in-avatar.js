import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class LoggedInAvatarComponent extends Component {
  @service game;

  get avatarImage() {
    let user = this.game.currentUser;
    let avatar = user ? user.get('photo') : 'phil-head.png';

    return `/assets/${avatar}`;
  }
}
