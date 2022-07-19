import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LeaderboardComponent extends Component {
  @service store;
  @tracked selectedLeaderboard = "Current";

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

  @cached
  get leaderboards() {
    let leaderboards = ['Current'];
    let oldSeasons = this.store.peekAll('leaderboard').map(leaderboard => leaderboard.season);
    return leaderboards.concat([...new Set(oldSeasons)]);
  }

  get leaderboardRows() {
    if(this.selectedLeaderboard === "Current") {
      return this.orderedTotals;
    } else {
      return this.store.peekAll('leaderboard').filter(leaderboard => leaderboard.season === this.selectedLeaderboard);
    }
  }

  get orderedTotals() {
    return this.args.babbers
      .map((babber) => {
        let gamesPlayed = this.gamesPlayed;
        let wins = this.args.games.filter((game) => {
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
        let drawnWinnings = drawnGames.map((game) => 40 / game.winners.length).reduce((a, b) => a + b, 0);
        let losses = gamesPlayed - wins - drawnGames.length;
        let total = wins * 40 + drawnWinnings - gamesPlayed * 5;
        let gameweeksPlayed = this.store
          .peekAll('selection')
          .filter(
            (selection) => selection.get('babber.id') === babber.get('id')
          ).length;
        let babberStanding = {
          gamesPlayed,
          wins,
          draws: drawnGames.length,
          losses,
          total,
          babber,
          gameweeksPlayed,
        };
        return babberStanding;
      })
      .sortBy('total')
      .reverse();
  }

  @action
  setLeaderboard(event) {
    console.log(`Setting leaderboard to ${event.target.value}`);
    this.selectedLeaderboard = event.target.value;
  }
}
