import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class GameService extends Service {
  @service store;

  previousGameweeks(gameweek) {
    return this.store
      .peekAll('gameweek')
      .filter(
        (gameweekRecord) => parseInt(gameweekRecord.id) < parseInt(gameweek.id)
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
