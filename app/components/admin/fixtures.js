import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import rawFixtures from 'last-man-standing/data/fixtures';
import { data as rawClubs } from 'last-man-standing/data/clubs';
import { task } from 'ember-concurrency';

export default class AdminFixturesComponent extends Component {
  @service store;

  @action
  createGameweeks() {
    this.parseRawFixtures();
  }

  @action
  createFixture() {
    this.createFixtureAsync.perform();
  }

  @task
  *createFixtureAsync() {
    let fixture = rawFixtures.pages[0].content[0];
    let clubs = yield this.store.findAll('club');
    let gameweekId = fixture.gameweek.gameweek;

    let gameweek = this.store.createRecord('gameweek');
    gameweek.label = gameweekId;

    yield gameweek.save();

    let homeTeamName = fixture.teams[0].team.name;
    let awayTeamName = fixture.teams[1].team.name;

    let homeTeam = clubs.findBy('name', homeTeamName);
    let awayTeam = clubs.findBy('name', awayTeamName);

    let kickoff = new Date(fixture.kickoff.millis);

    let fixtureRecord = this.store.createRecord('fixture');
    fixtureRecord.gameweek = gameweek;
    fixtureRecord.homeTeam = homeTeam;
    fixtureRecord.awayTeam = awayTeam;
    fixtureRecord.kickoff = kickoff;

    yield fixtureRecord.save();
    yield gameweek.save();
  }

  @action
  createClubs() {
    rawClubs.forEach((club) => {
      this.store
        .createRecord('club', {
          name: club.name,
          logo: club.logo,
        })
        .save();
    });
  }

  parseRawFixtures() {
    rawFixtures.pages.forEach((page) => {
      page.content.forEach((fixture) => {
        this.createGameweek.perform(fixture);
      });
    });
  }

  @task
  *createFixtureAndGameweek(fixture) {
    let gameweeks = this.store.peekAll('gameweek');
    let clubs = this.store.peekAll('club');

    let gameweekId = fixture.gameweek.gameweek;
    let gameweek = gameweeks.findBy('label', gameweekId);

    if (gameweek == null) {
      gameweek = this.store.createRecord('gameweek');
      gameweek.label = gameweekId;

      yield gameweek.save();
    }

    let homeTeamName = fixture.teams[0].team.name;
    let awayTeamName = fixture.teams[1].team.name;

    let homeTeam = clubs.findBy('name', homeTeamName);
    let awayTeam = clubs.findBy('name', awayTeamName);

    let kickoff = new Date(fixture.kickoff.millis);

    let fixtureRecord = this.store.createRecord('fixture');
    fixtureRecord.gameweek = gameweek;
    fixtureRecord.homeTeam = homeTeam;
    fixtureRecord.awayTeam = awayTeam;
    fixtureRecord.kickoff = kickoff.toISOString();

    yield fixtureRecord.save();
  }

  @task
  *createGameweek(fixture) {
    let gameweeks = this.store.peekAll('gameweek');

    let gameweekId = fixture.gameweek.gameweek;
    let gameweek = gameweeks.findBy('label', gameweekId);

    if (gameweek == null) {
      gameweek = this.store.createRecord('gameweek');
      gameweek.label = gameweekId;

      yield gameweek.save();
    }
  }
}
