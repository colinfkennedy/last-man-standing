import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { data as clubs } from 'last-man-standing/data/clubs';
import { data as rawFixtures } from 'last-man-standing/data/fixtures';

export default class LastManStandingRoute extends Route {
  @service store;

  model() {
    clubs.forEach((club) => {
      this.store.createRecord('club', {
        name: club.name,
        logo: club.logo,
      });
    });

    let clubsRecords = this.store.peekAll('club');

    this.parseRawFixtures(clubsRecords);

    return {
      clubs: clubsRecords,
      gameweeks: this.store.peekAll('gameweek'),
    };
  }

  parseRawFixtures(clubs) {
    rawFixtures.pages.forEach((page) => {
      console.log('page', page);
      page.content.forEach((fixture) => {
        let gameweekId = fixture.gameweek.gameweek;
        let gameweek = this.store.peekRecord('gameweek', gameweekId);
        if (gameweek == null) {
          gameweek = this.store.createRecord('gameweek', { id: gameweekId });
        }

        let homeTeamName = fixture.teams[0].team.name;
        let awayTeamName = fixture.teams[1].team.name;

        let homeTeam = clubs.findBy('name', homeTeamName);
        let awayTeam = clubs.findBy('name', awayTeamName);

        let fixtureRecord = this.store.createRecord('fixture', {
          gameweek,
          homeTeam,
          awayTeam,
        });

        console.log(
          `${fixtureRecord.get('homeTeam.name')} v ${fixtureRecord.get('awayTeam.name')} - Gameweek ${fixtureRecord.gameweek.get('id')}`
        );
      });
    });
  }
}
