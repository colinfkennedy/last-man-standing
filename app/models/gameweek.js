import Model, { attr, hasMany } from '@ember-data/model';
import { isPresent } from '@ember/utils';

export default class GameweekModel extends Model {
  @attr('string') label;
  @hasMany('fixture') fixtures;
  @hasMany('selection') selections;

  get losingTeams() {
    return this.fixtures.map((fixture) => fixture.losingTeam).compact();
  }

  get losingSelections() {
    return this.selections.filter((selection) => {
      if (isPresent(selection.club)) {
        return isPresent(
          this.losingTeams.findBy('name', selection.get('club.name'))
        );
      } else {
        return false;
      }
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
}
