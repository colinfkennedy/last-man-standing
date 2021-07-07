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

  previousSelections(gameweek, babber) {
    let relevantGameweeks = this.gameForGameweek(gameweek).gameweeks.map(
      (gameweekRecord) => gameweekRecord.label
    );
    //Remove current gameweek
    relevantGameweeks = relevantGameweeks.removeObject(gameweek.get('label'));
    return babber
      .get('selections')
      .filter((selection) => {
        return relevantGameweeks.includes(selection.gameweek.get('label'));
      })
      .map((selection) => selection.get('club.name'));
  }

  clubsForGameweek(gameweek, babber) {
    let alreadySelected = this.previousSelections(gameweek, babber);

    return gameweek
      .get('clubs')
      .filter((club) => !alreadySelected.includes(club.get('name')))
      .sortBy('name');
  }

  defaultSelection(babber, gameweek) {
    let relevantGameweeks = this.gameForGameweek(gameweek).gameweeks.map(
      (gameweek) => gameweek.label
    );

    let alreadySelected = this.previousSelections(gameweek, babber);

    let previousAlphabetPicks =
      relevantGameweeks.indexOf(gameweek.label) - alreadySelected.length;

    let club = this.clubsForGameweek(gameweek, babber).slice(
      previousAlphabetPicks,
      100
    ).firstObject;

    let alphabetSelection = EmberObject.create({
      babber,
      club,
      gameweek,
      isAlphabetPick: true,
    });

    return alphabetSelection;
  }
}
