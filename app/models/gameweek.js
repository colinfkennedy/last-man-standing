import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';

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
    return this.fixtures.map((fixture) => fixture.losingTeam).compact();
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
      gameweekSelection = gameweekSelection || this.defaultSelection(babber);
      gameweekSelection.lost = this.isLosingSelection(gameweekSelection);
      return gameweekSelection;
    });
  }

  defaultSelection(babber) {
    let clubs = this.store.peekAll('club');
    let alreadySelected = babber.selections.map((selection) =>
      selection.get('club.name')
    );
    //TODO Fix this for games that don't start on gameweek 1.
    let previousAlphabetPicks =
      parseInt(this.label) - 1 - alreadySelected.length;

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

  get start() {
    return this.fixtures.map((fixture) => fixture.kickoff).sort((a, b) => b - a)
      .lastObject;
  }

  get end() {
    return this.fixtures.map((fixture) => fixture.kickoff).sort((a, b) => a - b)
      .lastObject;
  }
}
