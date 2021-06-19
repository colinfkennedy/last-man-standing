import Component from '@glimmer/component';
import { inject as service } from '@ember/service'
import { action } from '@ember/object';
import { data as rawFixtures } from 'last-man-standing/data/fixtures';
import { data as rawClubs } from 'last-man-standing/data/clubs';

export default class AdminFixturesComponent extends Component {
  @service store;

  @action
  createGameweek() {
    this.store.createRecord('gameweek', {
      label: 1,
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
            id: gameweekId,
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
