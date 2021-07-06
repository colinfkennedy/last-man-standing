import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class GameService extends Service {
  @service store;

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
    return this.store
      .peekAll('gameweek')
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
