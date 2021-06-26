import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import rawFixtures from 'last-man-standing/data/fixtures';

export default class LastManStandingRoute extends Route {
  @service store;

  async model() {
    let clubs = await this.store.findAll('club');
    let babbers = await this.store.findAll('babber');

    this.parseRawFixtures(clubs);

    babbers.forEach((babber) => {
      let clubRecord = clubs.findBy('name', 'Manchester United');

      this.store.createRecord('selection', {
        babber: babber,
        club: clubRecord,
        gameweek: this.store.peekRecord('gameweek', 1),
      });
    });

    return {
      clubs: clubs,
      gameweeks: this.store.peekAll('gameweek'),
      selections: this.store.peekAll('selection'),
      babbers: babbers,
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

        let kickoff = new Date(fixture.kickoff.millis);

        this.store.createRecord('fixture', {
          gameweek,
          homeTeam,
          awayTeam,
          kickoff,
        });
      });
    });
  }
}
