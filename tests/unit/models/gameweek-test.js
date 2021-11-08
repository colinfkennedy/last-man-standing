import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupFactoryGuy, make, makeList } from 'ember-data-factory-guy';

module('Unit | Model | gameweek', function (hooks) {
  setupTest(hooks);
  setupFactoryGuy(hooks);

  test('winner does not show when one person left and  game not finished', function (assert) {
    let babbers = makeList('babber', 2);
    let gameweek = make('gameweek');
    let clubs = makeList('club', 2);

    make('game', {
      startGameweek: gameweek,
      endGameweek: gameweek,
    });

    make('fixture', 'withHomeTeamWin', {
      gameweek: gameweek,
      homeTeam: clubs[0],
      awayTeam: clubs[1],
      status: 'U',
    });

    make('selection', {
      babber: babbers[0],
      club: clubs[0],
      gameweek: gameweek,
    });

    make('selection', {
      babber: babbers[1],
      club: clubs[1],
      gameweek: gameweek,
    });

    assert.notOk(gameweek.winner, 'No winner returned');
  });

  test('winner shows when one person left and selection game finished', function (assert) {
    let babbers = makeList('babber', 2);
    let gameweek = make('gameweek');
    let clubs = makeList('club', 2);

    make('game', {
      startGameweek: gameweek,
      endGameweek: gameweek,
    });

    make('fixture', 'withHomeTeamWin', {
      gameweek: gameweek,
      homeTeam: clubs[0],
      awayTeam: clubs[1],
      status: 'C',
    });

    make('selection', {
      babber: babbers[0],
      club: clubs[0],
      gameweek: gameweek,
    });

    make('selection', {
      babber: babbers[1],
      club: clubs[1],
      gameweek: gameweek,
    });

    assert.equal(
      gameweek.winner.get('name'),
      babbers[0].get('name'),
      'One winner returned'
    );
  });
});
