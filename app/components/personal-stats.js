import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { cached } from '@glimmer/tracking';

export default class PersonalStatsComponent extends Component {
  @service game;

  @cached
  get topFiveClubs() {
    let selectedClubs = this.winningSelections.map(selection => selection.get('club'));
    var counts = selectedClubs.reduce((p, c) => {
      var name = c.get('name');
      if (!p.hasOwnProperty(name)) {
        p[name] = {
          club: c,
          count: 0,
        };
      }
      p[name].count++;
      return p;
    }, {});
    
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
  }

  @cached
  get bottomFiveClubs() {
    let selectedClubs = this.losingSelections.map(selection => selection.get('club'));
    var counts = selectedClubs.reduce((p, c) => {
      var name = c.get('name');
      if (!p.hasOwnProperty(name)) {
        p[name] = {
          club: c,
          count: 0,
        };
      }
      p[name].count++;
      return p;
    }, {});
    
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
  }

  @cached
  get mySelections() {
    return this.args.selections.filter(selection => selection.get('babber.id') === this.game.currentUser.id);
  }

  @cached
  get losingSelections() {
    return this.mySelections.filter(selection => selection.get('lost'));
  }

  @cached
  get winningSelections() {
    return this.mySelections.reject(selection => selection.get('lost'));
  }

  @cached
  get gameweeksPlayed() {
    return this.mySelections.length;
  }

  get gamesWon() {
    return this.args.games.filter((game) => {
      if (game.winners) {
        return (
          game.winners.length === 1 && game.winners.includes(this.game.currentUser.id)
        );
      } else {
        return false;
      }
    }).length;
  }

  get drawnGames() {
    return this.args.games.filter((game) => {
      if (game.winners) {
        return game.winners.length > 1 && game.winners.includes(this.game.currentUser.id);
      } else {
        return false;
      }
    })
  }

  get gamesDrawn() {
    return this.drawnGames.length;
  }

  get gamesLost() {
    return this.gamesPlayed - this.gamesWon - this.gamesDrawn;
  }

  get gamesPlayed() {
    return this.args.games.length;
  }

  get totalWinnings() {
    let drawnWinnings = this.drawnGames.map((game) => 40 / game.winners.length);
    return (this.gamesWon * 40) + drawnWinnings - (this.gamesPlayed * 5);
  }
}
