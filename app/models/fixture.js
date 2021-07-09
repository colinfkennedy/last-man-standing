import Model, { attr, belongsTo } from '@ember-data/model';
import { cached } from '@glimmer/tracking';

export default class FixtureModel extends Model {
  @attr('date') kickoff;
  @belongsTo('club', { inverse: null }) homeTeam;
  @belongsTo('club', { inverse: null }) awayTeam;
  @belongsTo('gameweek') gameweek;
  @attr('number') homeScore;
  @attr('number') awayScore;

  @cached
  get losingTeam() {
    if (this.homeScore > this.awayScore) {
      return this.awayTeam;
    } else if (this.awayScore > this.homeScore) {
      return this.homeTeam;
    } else {
      return null;
    }
  }

  @cached
  get hasScore() {
    return this.homeScore !== undefined && this.awayScore !== undefined;
  }
}
