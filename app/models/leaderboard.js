import Model, { attr, belongsTo } from '@ember-data/model';

export default class LeaderboardModel extends Model {
  @attr('string') season;
  @attr('number') total;
  @attr('number') gameweeksPlayed;
  @attr('number') draws;
  @attr('number') gamesPlayed;
  @attr('number') losses;
  @attr('number') wins;
  @belongsTo('babber') babber;
}