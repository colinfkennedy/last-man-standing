import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class GameService extends Service {
  @service store;

  gameForGameweek(gameweek) {
    let games = this.store.peekAll('game');
    let gameweekId = parseInt(gameweek.label);
    let relevantGame = games.filter((game) => {
      return (
        gameweekId >= parseInt(game.get('startGameweek.label')) &&
        gameweekId <= parseInt(game.get('endGameweek.label'))
      );
    }).firstObject;

    return relevantGame;
  }

  get currentGameweek() {
    let now = new Date('August 27, 2021 03:24:00');
    return this.store
      .peekAll('gameweek')
      .sortBy('start')
      .find((gameweek) => {
        return now.setHours(1) < gameweek.end;
      });
  }

  previousGameweeks(gameweek) {
    let relevantGame = this.gameForGameweek(gameweek);

    return this.store
      .peekAll('gameweek')
      .filter((gameweekRecord) => {
        return (
          parseInt(gameweekRecord.label) >=
            parseInt(relevantGame.get('startGameweek.label')) &&
          parseInt(gameweekRecord.label) <=
            parseInt(relevantGame.get('endGameweek.label'))
        );
      })
      .filter(
        (gameweekRecord) =>
          parseInt(gameweekRecord.label) < parseInt(gameweek.label)
      );
  }

  babbersForGameweek(gameweek) {
    let loserIds = [];
    let babbers = this.store.peekAll('babber');
    this.previousGameweeks(gameweek).forEach((gameweekRecord) => {
      gameweekRecord.losingSelections.forEach((selection) => {
        loserIds.push(selection.babber.get('id'));
      });
    });
    return babbers.reject((babber) => loserIds.includes(babber.id));
  }
}
