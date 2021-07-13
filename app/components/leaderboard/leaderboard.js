import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { cached } from '@glimmer/tracking';

export default class LeaderboardLeaderboardComponent extends Component {
  @service store;

  @cached
  get gamesPlayed() {
    return this.args.games.length;
  }

  @cached
  get gamesWithWinners() {
    return this.args.games.reject((game) => {
      return game.winner.get('id') === undefined;
    });
  }

  get orderedTotals() {
    return this.args.babbers
      .map((babber) => {
        let played = this.gamesPlayed;
        let won = this.args.games.filterBy('winner.id', babber.id).length;
        let lost = this.gamesWithWinners.rejectBy(
          'winner.id',
          babber.id
        ).length;
        let total = won * 40 - played * 5;
        let babberStanding = {
          played,
          won,
          drawn: 0,
          lost,
          total: `€${total}`,
          babber: babber,
        };
        return babberStanding;
      })
      .sortBy('total')
      .reverse();
  }
}
