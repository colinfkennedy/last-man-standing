import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { data as clubs } from 'last-man-standing/data/clubs';
import { data as babbers } from 'last-man-standing/data/babbers';
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

    babbers.forEach((babber) => {
      let babberRecord = this.store.createRecord('babber', {
        name: babber.name,
        photo: babber.photo,
      });
      let clubRecord = clubsRecords.findBy('name', 'Manchester United');

      this.store.createRecord('selection', {
        babber: babberRecord,
        club: clubRecord,
        gameweek: this.store.peekRecord('gameweek', 1),
      });
    });

    return {
      clubs: clubsRecords,
      gameweeks: this.store.peekAll('gameweek'),
      selections: this.store.peekAll('selection'),
      babbers: this.store.peekAll('babber'),
    };
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
