import Component from '@glimmer/component';
import { inject as service } from '@ember/service'
import { action } from '@ember/object';
import { data as rawFixtures } from 'last-man-standing/data/fixtures';
import { data as rawClubs } from 'last-man-standing/data/clubs';

export default class AdminFixturesComponent extends Component {
  @service store;

  @action
  createGameweeks() {
    this.store.findAll('clubs').then((clubs) => {
      // this.parseRawFixtures(clubs);
      this.createFixture(fixture, clubs);
    });
  }

  @action
  createFixture() {
    this.createFixtureAsync();
  }

  async createFixtureAsync() {
    let fixture = rawFixtures.pages[0].content[0];
    debugger;
    let clubs = await this.store.findAll('club');
    let gameweekId = fixture.gameweek.gameweek;

    let gameweek = await this.store.createRecord('gameweek', {
      label: gameweekId,
    }).save();


    let homeTeamName = fixture.teams[0].team.name;
    let awayTeamName = fixture.teams[1].team.name;

    let homeTeam = clubs.findBy('name', homeTeamName);
    let awayTeam = clubs.findBy('name', awayTeamName);

    await this.store.createRecord('fixture', {
      gameweek,
      homeTeam,
      awayTeam,
    }).save();
  }

  @action
  createClubs() {
    rawClubs.forEach((club) => {
      this.store.createRecord('club', {
        name: club.name,
        logo: club.logo,
      }).save();
    })
  }

  parseRawFixtures(clubs) {
    rawFixtures.pages.forEach((page) => {
      page.content.forEach((fixture) => {
        let gameweekId = fixture.gameweek.gameweek;
        let gameweek = this.store.peekRecord('gameweek', gameweekId);
        if (gameweek == null) {
          gameweek = this.store.createRecord('gameweek', {
            label: gameweekId,
          });
        }

        let homeTeamName = fixture.teams[0].team.name;
        let awayTeamName = fixture.teams[1].team.name;

        let homeTeam = clubs.findBy('name', homeTeamName);
        let awayTeam = clubs.findBy('name', awayTeamName);

        this.store.createRecord('fixture', {
          gameweek,
          homeTeam,
          awayTeam,
        });
      });
    });
  }
}
