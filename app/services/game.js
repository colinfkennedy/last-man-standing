import Service from '@ember/service';
import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import { cached } from '@glimmer/tracking';

export default class GameService extends Service {
  @service store;

  @cached
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
        parseInt(gameweekRecord.get('label')) < parseInt(gameweek.get('label'))
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
    let previousGameweeks = this.previousGameweeks(gameweek).mapBy('label');

    return babber
      .get('selections')
      .filter((selection) => {
        return previousGameweeks.includes(selection.gameweek.get('label'));
      })
      .map((selection) => selection.get('club.name'));
  }

  clubsForGameweek(gameweek, babber) {
    let relevantGameweeks = this.gameForGameweek(gameweek).gameweeks.map(
      (gameweek) => gameweek.label
    );
    let alreadySelected = this.previousSelections(gameweek, babber);

    let clubsForGameweek = gameweek
      .get('clubs')
      .filter((club) => !alreadySelected.includes(club.get('name')))
      .sortBy('name');

    let previousAlphabetPicks =
      relevantGameweeks.indexOf(gameweek.get('label')) - alreadySelected.length;

    return clubsForGameweek.slice(previousAlphabetPicks, 100);
  }

  defaultSelection(babber, gameweek) {
    let club = this.clubsForGameweek(gameweek, babber).firstObject;

    let alphabetSelection = EmberObject.create({
      babber,
      club,
      gameweek,
      isAlphabetPick: true,
    });

    return alphabetSelection;
  }
}
