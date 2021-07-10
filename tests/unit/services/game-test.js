import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import { setupFactoryGuy, make } from 'ember-data-factory-guy';

module('Unit | Service | game', function (hooks) {
  setupTest(hooks);
  setupFactoryGuy(hooks);

  module('currentGameweek', function(hooks){
    test('when in first gameweek, currentGameweek returns the first gameweek', function (assert) {
      let clock = sinon.useFakeTimers({
        now: new Date('August 1, 2021 01:00:00'),
        shouldAdvanceTime: true,
      });

      let testGameweek = make('gameweek', 'withFixtures');

      let game = this.owner.lookup('service:game');

      assert.equal(
        game.currentGameweek.label,
        testGameweek.label,
        'Returns the correct gameweek'
      );

      clock.restore();
    });

    test('when in second gameweek, currentGameweek returns the second gameweek', function (assert) {
      let clock = sinon.useFakeTimers({
        now: new Date('August 10, 2021 01:00:00'),
        shouldAdvanceTime: true,
      });

      make('gameweek', 'withFixtures');

      let testGameweek2 = make('gameweek');

      make('fixture', {
        kickoff: new Date('August 10, 2021 15:00:00'),
        gameweek: testGameweek2,
      });

      let game = this.owner.lookup('service:game');

      assert.equal(
        game.currentGameweek.label,
        testGameweek2.label,
        'Returns the second gameweek'
      );

      clock.restore();
    });
  });

  module('gameForGameweek', function(hooks){
    test('', function (assert) {

    });
  });
});
