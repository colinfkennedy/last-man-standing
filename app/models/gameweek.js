import Model, { attr, hasMany } from '@ember-data/model';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';

export default class GameweekModel extends Model {
  @attr('string') label;
  @hasMany('fixture') fixtures;
  @hasMany('selection') selections;
  @service store;

  get losingTeams() {
    return this.fixtures.map((fixture) => fixture.losingTeam).compact();
  }

  get losingSelections() {
    return this.selectionsWithDefaults.filter((selection) => {
      if (isPresent(selection.club)) {
        return isPresent(
          this.losingTeams.findBy('name', selection.get('club.name'))
        );
      } else {
        return false;
      }
    });
  }

  get selectionsWithDefaults() {
    let babbers = this.store.peekAll('babber');

    return babbers.map((babber) => {
      let gameweekSelection = this.selections.findBy(
        'babber.name',
        babber.name
      );
      return gameweekSelection || this.defaultSelection(babber);
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
