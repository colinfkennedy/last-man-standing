import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';

export default class GameweekModel extends Model {
  @attr('string') label;
  @hasMany('fixture') fixtures;
  @hasMany('selection') selections;
  @belongsTo('game') gameRecord;
  @service store;
  @service game;

  get winner() {
    let winner;
    if (this.winningSelections.length === 1) {
      winner = this.winningSelections.firstObject.get('babber');
    }
    return winner;
  }

  get losingTeams() {
    return this.fixtures.mapBy('losingTeam').compact();
  }

  isLosingSelection(selection) {
    if (isPresent(selection.club)) {
      return isPresent(
        this.losingTeams.findBy('name', selection.get('club.name'))
      );
    } else {
      return false;
    }
  }

  get eligibleBabbers() {
    return this.game.babbersForGameweek(this);
  }

  get winningSelections() {
    return this.selectionsWithDefaults.reject((selection) => selection.lost);
  }

  get losingSelections() {
    return this.selectionsWithDefaults.filter((selection) => selection.lost);
  }

  get selectionsWithDefaults() {
    return this.eligibleBabbers.map((babber) => {
      let gameweekSelection = this.selections.findBy(
        'babber.name',
        babber.name
      );
      gameweekSelection =
        gameweekSelection || this.game.defaultSelection(babber, this);
      gameweekSelection.lost = this.isLosingSelection(gameweekSelection);
      return gameweekSelection;
    });
  }

  get start() {
    return this.fixtures.map((fixture) => fixture.kickoff).sort((a, b) => b - a)
      .lastObject;
  }

  get end() {
    return this.fixtures.map((fixture) => fixture.kickoff).sort((a, b) => a - b)
      .lastObject;
  }

  get clubs() {
    let homeTeams = this.fixtures.getEach('homeTeam');
    let awayTeams = this.fixtures.getEach('awayTeam');
    return homeTeams.concat(awayTeams);
  }
}
