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

  @action
  createUser() {
    this.createUserAsync.perform();
  }

  @task
  *createUserAsync() {
    const user = new Parse.User();
    user.set('username', 'stephen');
    user.set('name', 'Stephen');
    user.set('photo', 'babb/stephen.png');
    user.set('email', 'stephenking83@gmail.com');
    user.set('password', 'stephen');

    try {
      let userResult = yield user.signUp();
      console.log('User signed up', userResult);
    } catch (error) {
      console.error('Error while signing up user', error);
    }
  }

  @action
  createRole() {
    this.createRoleAsync.perform();
  }

  @task
  *createRoleAsync() {
    const roleACL = new Parse.ACL();
    roleACL.setPublicReadAccess(true);
    roleACL.setPublicWriteAccess(true);
    const role = new Parse.Role('Babber', roleACL);
    let response = yield role.save();
    console.log('Role created', response);
  }

  @action
  updateRole() {
    this.updateRoleAsync.perform();
  }

  @task
  *updateRoleAsync() {
    let userQuery = new Parse.Query(Parse.User);
    let colin = yield userQuery.get('XiIbeWrSJD');
    let coman = yield userQuery.get('Hf2PJBGFBa');
    let eoin = yield userQuery.get('grP4aojelL');
    let stephen = yield userQuery.get('KHKy6pwf0P');
    let sean = yield userQuery.get('Eyl9rMsno7');
    let paddy = yield userQuery.get('vmGqDpWAs1');
    let paul = yield userQuery.get('DUFbSi04uT');
    let joe = yield userQuery.get('8Rpi7LhHpQ');
    let usersToAddToRole = [
      colin,
      coman,
      eoin,
      stephen,
      sean,
      paddy,
      paul,
      joe,
    ];

    const roleQuery = new Parse.Query(Parse.Role);
    // let adminRole = yield roleQuery.get('jvRLSjHY9k');
    let babberRole = yield roleQuery.get('fnFEXIW7oS');
    babberRole.getUsers().add(usersToAddToRole);
    let response = yield babberRole.save();
    console.log('Role updated', response);
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
