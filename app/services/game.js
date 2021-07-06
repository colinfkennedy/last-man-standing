import Service from '@ember/service';
import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';

export default class GameService extends Service {
  @service store;

  get currentGameweek() {
    let now = new Date();
    return this.store
      .peekAll('gameweek')
      .sortBy('start')
      .find((gameweek) => {
        return now.setHours(1) < gameweek.end;
      });
  }

  gameForGameweek(gameweek) {
    let games = this.store.peekAll('game');
    let relevantGame = games.filter((game) =>
      game.hasGameweek(gameweek)
    ).firstObject;

    return relevantGame;
  }

  previousGameweeks(gameweek) {
    let relevantGame = this.gameForGameweek(gameweek);

    return relevantGame.gameweeks.filter(
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

  defaultSelection(babber, gameweek) {
    let clubs = this.store.peekAll('club');
    let relevantGameweeks = this.gameForGameweek(gameweek).gameweeks.map(
      (gameweek) => gameweek.label
    );
    let alreadySelected = babber.selections
      .filter((selection) => {
        return relevantGameweeks.includes(selection.gameweek.get('label'));
      })
      .map((selection) => selection.get('club.name'));

    let previousAlphabetPicks =
      relevantGameweeks.indexOf(gameweek.label) - alreadySelected.length;

    let club = clubs
      .filter((club) => !alreadySelected.includes(club.name))
      .sortBy('name')
      .slice(previousAlphabetPicks, 100).firstObject;

    let alphabetSelection = EmberObject.create({
      babber,
      club,
      gameweek: this,
      isAlphabetPick: true,
    });

    return alphabetSelection;
  }
}
