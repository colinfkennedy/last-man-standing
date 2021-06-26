import Component from '@glimmer/component';
import { isPresent } from '@ember/utils';

export default class GameweekSelectionComponent extends Component {
  get hasSelection() {
    return isPresent(this.selection);
  }

  get noSelection() {
    return !this.hasSelection;
  }

  get selection() {
    return this.args.gameweek.selections.findBy(
      'babber.name',
      this.args.babber.name
    );
  }

  get clubSelection() {
    return this.selection?.club;
  }
}
