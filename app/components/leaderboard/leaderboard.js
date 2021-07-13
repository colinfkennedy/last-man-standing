import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class LeaderboardLeaderboardComponent extends Component {
  @service store;

  get orderedTotals() {
    return this.store.peekAll('babber').map((babber) => {
      let babberStanding = {
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        total: 0,
        babber: babber,
      };
      return babberStanding;
    });
  }
}
