import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import { setupFactoryGuy, make, makeList } from 'ember-data-factory-guy';

module('Unit | Service | game', function (hooks) {
  setupTest(hooks);
  setupFactoryGuy(hooks);

  // eslint-disable-next-line no-unused-vars
  module('currentGameweek', function (hooks) {
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

  // eslint-disable-next-line no-unused-vars
  module('gameForGameweek', function (hooks) {
    test('with three gameweeks in a game, the middle gameweek returns the right game', function (assert) {
      let gameweeks = makeList('gameweek', 3);
      let gameRecord = make('game', {
        startGameweek: gameweeks[0],
        endGameweek: gameweeks[2],
      });
      let game = this.owner.lookup('service:game');

      assert.equal(
        game.gameForGameweek(gameweeks[1]).label,
        gameRecord.label,
        'Returns the correct game'
      );
    });
  });

  // eslint-disable-next-line no-unused-vars
  module('previousGameweeks', function (hooks) {
    test('with three gameweeks in a game, the last gameweek returns the previous two', function (assert) {
      let gameweeks = makeList('gameweek', 3);
      make('game', {
        startGameweek: gameweeks[0],
        endGameweek: gameweeks[2],
      });
      let game = this.owner.lookup('service:game');

      let previousGameweeks = game.previousGameweeks(gameweeks[2]);

      assert.equal(
        previousGameweeks.length,
        2,
        'There are two previous gameweeks'
      );

      assert.equal(
        previousGameweeks[0].label,
        gameweeks[0].label,
        'The first previous gameweek is correct'
      );

      assert.equal(
        previousGameweeks[1].label,
        gameweeks[1].label,
        'The second previous gameweek is correct'
      );
    });

    test('with three gameweeks in a game, the first gameweek returns no previous gameweeks', function (assert) {
      let gameweeks = makeList('gameweek', 3);
      make('game', {
        startGameweek: gameweeks[0],
        endGameweek: gameweeks[2],
      });
      let game = this.owner.lookup('service:game');

      let previousGameweeks = game.previousGameweeks(gameweeks[0]);

      assert.equal(
        previousGameweeks.length,
        0,
        'There are no previous gameweeks'
      );
    });
  });

  // eslint-disable-next-line no-unused-vars
  module('babbersForGameweek', function (hooks) {
    test('with two babbers and first gameweek, returns both babbers', function (assert) {
      let babbers = makeList('babber', 2);
      let gameweeks = makeList('gameweek', 3);
      make('game', {
        startGameweek: gameweeks[0],
        endGameweek: gameweeks[2],
      });
      let game = this.owner.lookup('service:game');

      let babbersForGameweek = game.babbersForGameweek(gameweeks[0]);

      assert.equal(babbersForGameweek.length, 2, 'Returns all babbers');

      assert.equal(
        babbersForGameweek[0].name,
        babbers[0].name,
        'Returns first babber'
      );

      assert.equal(
        babbersForGameweek[1].name,
        babbers[1].name,
        'Returns second babber'
      );
    });

    test('with two babbers and one loser in gameweek, returns only winning babbers', function (assert) {
      let babbers = makeList('babber', 2);
      let clubs = makeList('club', 2);
      let gameweeks = makeList('gameweek', 3);

      make('fixture', 'withHomeTeamWin', {
        gameweek: gameweeks[0],
        homeTeam: clubs[0],
        awayTeam: clubs[1],
      });

      make('selection', {
        babber: babbers[0],
        club: clubs[1],
        gameweek: gameweeks[0],
      });

      make('game', {
        startGameweek: gameweeks[0],
        endGameweek: gameweeks[2],
      });
      let game = this.owner.lookup('service:game');

      let babbersForGameweek = game.babbersForGameweek(gameweeks[1]);

      assert.equal(babbersForGameweek.length, 1, 'Returns only winning babber');

      assert.equal(
        babbersForGameweek[0].get('name'),
        babbers[1].get('name'),
        'Returns winning babber'
      );
    });
  });

  // eslint-disable-next-line no-unused-vars
  module('previousSelections', function (hooks) {
    test('with a babber and one previous selection, returns that selection', function (assert) {
      let babber = make('babber');
      let club = make('club');
      let gameweeks = makeList('gameweek', 3);
      make('game', {
        startGameweek: gameweeks[0],
        endGameweek: gameweeks[2],
      });

      make('selection', {
        babber,
        club,
        gameweek: gameweeks[0],
      });

      let game = this.owner.lookup('service:game');

      let previousSelections = game.previousSelections(gameweeks[2], babber);

      assert.equal(
        previousSelections.length,
        1,
        'Returns only one previous selection'
      );

      assert.equal(
        previousSelections[0],
        club.name,
        'Returns correct selection'
      );
    });

    test('with a babber a selection for a different gameweek, does not return that selection', function (assert) {
      let babber = make('babber');
      let club = make('club');
      let gameweeks = makeList('gameweek', 3);
      make('game', {
        startGameweek: gameweeks[0],
        endGameweek: gameweeks[2],
      });

      make('selection', {
        babber,
        club,
        gameweek: gameweeks[2],
      });

      let game = this.owner.lookup('service:game');

      let previousSelections = game.previousSelections(gameweeks[1], babber);

      assert.equal(
        previousSelections.length,
        0,
        'Returns no previous selections'
      );
    });

    test('with a babber a selection for previous gameweek but in a different game, does not return that selection', function (assert) {
      let babber = make('babber');
      let club = make('club');
      let gameweeks = makeList('gameweek', 4);
      make('game', {
        startGameweek: gameweeks[0],
        endGameweek: gameweeks[1],
      });

      make('game', {
        startGameweek: gameweeks[2],
        endGameweek: gameweeks[3],
      });

      make('selection', {
        babber,
        club,
        gameweek: gameweeks[0],
      });

      let game = this.owner.lookup('service:game');

      let previousSelections = game.previousSelections(gameweeks[2], babber);

      assert.equal(
        previousSelections.length,
        0,
        'Returns no previous selections'
      );
    });
  });

  // eslint-disable-next-line no-unused-vars
  module('clubsForGameweek', function (hooks) {
    test('with four clubs, first gameweek returns all clubs', function (assert) {
      let babber = make('babber');
      let clubs = makeList('club', 4);
      let gameweeks = makeList('gameweek', 3);
      make('game', {
        startGameweek: gameweeks[0],
        endGameweek: gameweeks[2],
      });
      make('fixture', {
        homeTeam: clubs[0],
        awayTeam: clubs[1],
        gameweek: gameweeks[0],
      });
      make('fixture', {
        homeTeam: clubs[2],
        awayTeam: clubs[3],
        gameweek: gameweeks[0],
      });

      let game = this.owner.lookup('service:game');

      let clubsForGameweek = game.clubsForGameweek(gameweeks[0], babber);

      assert.equal(clubsForGameweek.length, 4, 'Returns all clubs');

      assert.equal(
        clubsForGameweek[0].get('name'),
        clubs[0].get('name'),
        'Returns first club'
      );
      assert.equal(
        clubsForGameweek[1].get('name'),
        clubs[1].get('name'),
        'Returns second club'
      );
      assert.equal(
        clubsForGameweek[2].get('name'),
        clubs[2].get('name'),
        'Returns third club'
      );
      assert.equal(
        clubsForGameweek[3].get('name'),
        clubs[3].get('name'),
        'Returns fourth club'
      );
    });

    test('with four clubs, second gameweek returns three clubs', function (assert) {
      let babber = make('babber');
      let clubs = makeList('club', 4);
      let gameweeks = makeList('gameweek', 3);
      make('game', {
        startGameweek: gameweeks[0],
        endGameweek: gameweeks[2],
      });
      make('fixture', {
        homeTeam: clubs[0],
        awayTeam: clubs[1],
        gameweek: gameweeks[1],
      });
      make('fixture', {
        homeTeam: clubs[2],
        awayTeam: clubs[3],
        gameweek: gameweeks[1],
      });

      let game = this.owner.lookup('service:game');

      let clubsForGameweek = game.clubsForGameweek(gameweeks[1], babber);

      assert.equal(clubsForGameweek.length, 3, 'Returns three clubs');

      assert.equal(
        clubsForGameweek[0].get('name'),
        clubs[1].get('name'),
        'Returns second club'
      );
      assert.equal(
        clubsForGameweek[1].get('name'),
        clubs[2].get('name'),
        'Returns third club'
      );
      assert.equal(
        clubsForGameweek[2].get('name'),
        clubs[3].get('name'),
        'Returns fourth club'
      );
    });

    test('with four clubs and a selection in gameweek one, second gameweek returns three clubs', function (assert) {
      let babber = make('babber');
      let clubs = makeList('club', 4);
      let gameweeks = makeList('gameweek', 3);
      make('game', {
        startGameweek: gameweeks[0],
        endGameweek: gameweeks[2],
      });
      make('fixture', {
        homeTeam: clubs[0],
        awayTeam: clubs[1],
        gameweek: gameweeks[1],
      });
      make('fixture', {
        homeTeam: clubs[2],
        awayTeam: clubs[3],
        gameweek: gameweeks[1],
      });

      make('selection', {
        babber,
        club: clubs[2],
        gameweek: gameweeks[0],
      });

      let game = this.owner.lookup('service:game');

      let clubsForGameweek = game.clubsForGameweek(gameweeks[1], babber);

      assert.equal(clubsForGameweek.length, 3, 'Returns three clubs');

      assert.equal(
        clubsForGameweek[0].get('name'),
        clubs[0].get('name'),
        'Returns second club'
      );
      assert.equal(
        clubsForGameweek[1].get('name'),
        clubs[1].get('name'),
        'Returns third club'
      );
      assert.equal(
        clubsForGameweek[2].get('name'),
        clubs[3].get('name'),
        'Returns fourth club'
      );
    });
  });
});
