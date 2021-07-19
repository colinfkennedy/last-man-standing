import Service from '@ember/service';
import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import { cached } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';

export default class GameService extends Service {
  @tracked sessionToken;
  @service store;

  getCurrentUser() {
    return Parse.User.current();
  }

  setSessionToken(sessionToken) {
    this.sessionToken = sessionToken;
  }

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

  previousRelevantGameweeks(gameweek) {
    let relevantGame = this.gameForGameweek(gameweek);
    let relevantGameweeks = relevantGame.gameweeks.sort((a, b) =>
      parseInt(a.get('label') - parseInt(b.get('label')))
    );
    let numberOfClubs = this.store.peekAll('club').length;

    let gameweekIndex = relevantGameweeks
      .mapBy('label')
      .indexOf(gameweek.get('label'));

    if (numberOfClubs > 1) {
      while (gameweekIndex >= numberOfClubs) {
        relevantGameweeks = relevantGameweeks.slice(numberOfClubs);
        gameweekIndex = relevantGameweeks
          .mapBy('label')
          .indexOf(gameweek.get('label'));
      }
    }

    return relevantGameweeks.filter(
      (gameweekRecord) =>
        parseInt(gameweekRecord.get('label')) < parseInt(gameweek.get('label'))
    );
  }

  previousSelections(gameweek, babber) {
    let previousGameweeks =
      this.previousRelevantGameweeks(gameweek).mapBy('label');

    return babber
      .get('selections')
      .filter((selection) => {
        return previousGameweeks.includes(selection.gameweek.get('label'));
      })
      .map((selection) => selection.get('club.name'));
  }

  clubsForGameweek(gameweek, babber) {
    let relevantGameweeks = this.previousRelevantGameweeks(gameweek);

    let alreadySelected = this.previousSelections(gameweek, babber);

    let clubsForGameweek = gameweek
      .get('clubs')
      .filter((club) => !alreadySelected.includes(club.get('name')))
      .sortBy('name');

    let previousAlphabetPicks =
      relevantGameweeks.length - alreadySelected.length;

    return clubsForGameweek.slice(previousAlphabetPicks);
  }

  defaultSelection(gameweek, babber) {
    let club = this.clubsForGameweek(gameweek, babber).firstObject;
    //TODO This logic is in two places - here and in selection model
    let lost = isPresent(
      gameweek.get('losingTeams').findBy('name', club.get('name'))
    );

    let alphabetSelection = EmberObject.create({
      babber,
      club,
      gameweek,
      lost,
      isAlphabetPick: true,
    });

    return alphabetSelection;
  }
}
