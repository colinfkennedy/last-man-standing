import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | last-man-standing', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:last-man-standing');
    assert.ok(route);
  });
});
