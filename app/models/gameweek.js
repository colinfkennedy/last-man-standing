import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { cached } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class GameweekModel extends Model {
  @attr('string') label;
  @hasMany('fixture') fixtures;
  @hasMany('selection') selections;
  @belongsTo('game') gameRecord;
  @service store;
  @service game;

  @cached
  get winner() {
    let winner;
    if (this.winningSelections.length === 1) {
      winner = this.winningSelections.firstObject.get('babber');
    }
    return winner;
  }

  @cached
  get winners() {
    let winners;
    if (this.winningSelections.length === 0 || this.endOfSeasonShare) {
      winners = this.eligibleBabbers;
    }
    return winners;
  }

  @cached
  get endOfSeasonShare() {
    return !this.winner && this.label === '38';
  }

  @cached
  get losingTeams() {
    return this.fixtures
      .filter((fixture) => fixture.isCompleted)
      .mapBy('losingTeam')
      .compact();
  }

  @cached
  get eligibleBabbers() {
    return this.game.babbersForGameweek(this);
  }

  @cached
  get winningSelections() {
    return this.selectionsWithDefaults.reject((selection) => selection.lost);
  }

  @cached
  get losingSelections() {
    return this.selectionsWithDefaults.filter((selection) => selection.lost);
  }

  @cached
  get selectionsWithDefaults() {
    return this.eligibleBabbers
      .map((babber) => {
        let gameweekSelection = this.selections.findBy(
          'babber.name',
          babber.name
        );
        gameweekSelection =
          gameweekSelection || this.game.defaultSelection(this, babber);
        return gameweekSelection;
      })
      .sort(this.sortByCurrentUser);
  }

  @action
  sortByCurrentUser(a, b) {
    let currentUserId = this.game.currentUser?.id;

    if (b.get('babber.id') === currentUserId) {
      return 1;
    } else if (a.get('babber.id') === currentUserId) {
      return -1;
    }
    return 0;
  }

  @cached
  get start() {
    return this.fixtures.map((fixture) => fixture.kickoff).sort((a, b) => b - a)
      .lastObject;
  }

  @cached
  get end() {
    return this.fixtures.map((fixture) => fixture.kickoff).sort((a, b) => a - b)
      .lastObject;
  }

  @cached
  get clubs() {
    let eligibleFixtures = this.fixtures.filter(
      (fixture) => !fixture.isPostponed
    );
    let homeTeams = eligibleFixtures.getEach('homeTeam');
    let awayTeams = eligibleFixtures.getEach('awayTeam');
    return homeTeams.concat(awayTeams);
  }
}
