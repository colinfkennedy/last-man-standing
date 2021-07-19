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
      return game.winners.length === 0;
    });
  }

  get orderedTotals() {
    return this.args.babbers
      .map((babber) => {
        let played = this.gamesPlayed;
        let won = this.args.games.filter((game) => {
          if (game.winners) {
            return (
              game.winners.length === 1 && game.winners.includes(babber.id)
            );
          } else {
            return false;
          }
        }).length;
        let drawnGames = this.args.games.filter((game) => {
          if (game.winners) {
            return game.winners.length > 1 && game.winners.includes(babber.id);
          } else {
            return false;
          }
        });
        let drawnWinnings = drawnGames.map((game) => 40 / game.winners.length);
        let lost = played - won - drawnGames.length;
        let total = won * 40 + drawnWinnings - played * 5;
        let babberStanding = {
          played,
          won,
          drawn: drawnGames.length,
          lost,
          total: total,
          babber: babber,
        };
        return babberStanding;
      })
      .sortBy('total')
      .reverse();
  }
}
