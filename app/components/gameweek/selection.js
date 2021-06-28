import Component from '@glimmer/component';
import { isPresent } from '@ember/utils';
import { cached } from '@glimmer/tracking';

export default class GameweekSelectionComponent extends Component {
  get hasSelection() {
    return isPresent(this.selection);
  }

  get noSelection() {
    return !this.hasSelection;
  }

  @cached
  get selection() {
    return this.args.babber
      .get('selections')
      .findBy('gameweek.id', this.args.gameweek.get('id'));
  }

  get clubSelection() {
    return this.selection?.club || this.args.babber.get('defaultSelection');
  }
}
