import Route from '@ember/routing/route';

export default class RulesRoute extends Route {
  activate() {
    super.activate();
    window.scrollTo(0, 0);
  }
}
