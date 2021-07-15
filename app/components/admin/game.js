import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class AdminGameComponent extends Component {
  @action
  setWinner(event) {
    let winners = [...event.target.options]
      .filter((option) => option.selected)
      .map((option) => option.value);
    console.log('winners', winners);
    this.args.game.winners = winners;
  }

  @action
  saveGame() {
    this.args.game.save();
  }

  get winners() {
    if (this.args.game.winners) {
      return this.args.game.winners.map((winnerId) =>
        this.args.babbers.findBy('id', winnerId)
      );
    } else {
      return null;
    }
  }
}
