import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import rawFixtures from 'last-man-standing/data/fixtures';
import { action } from '@ember/object';

export default class IndexRoute extends Route {
  @service store;
  @service game;

  activate() {
    super.activate();
    window.scrollTo(0, 0);
  }

  model() {
    return RSVP.hash({
      clubs: this.store.findAll('club'),
      babbers: this.store.findAll('babber'),
      gameweeks: this.store.findAll('gameweek'),
      games: this.store.findAll('game'),
      selections: this.store.findAll('selection'),
    });
  }

  // eslint-disable-next-line no-unused-vars
  afterModel(model) {
    let clubs = this.store.peekAll('club');
    let gameweeks = this.store.peekAll('gameweek');

    this.parseRawFixtures(clubs, gameweeks);
  }

  @action
  loading() {
    return true; // allows the loading template to be shown
  }

  parseRawFixtures(clubs, gameweeks) {
    let existingFixtures = this.store.peekAll('fixture');
    if (existingFixtures.length > 0) {
      return;
    }
    rawFixtures.pages.forEach((page) => {
      page.content.forEach((fixture) => {
        let gameweekId = fixture.gameweek.gameweek;
        //TODO fix that we don't need to toString gameweekID
        let gameweek = gameweeks.findBy('label', gameweekId.toString());

        let homeTeamName = fixture.teams[0].team.name;
        let awayTeamName = fixture.teams[1].team.name;

        let homeTeam = clubs.findBy('name', homeTeamName);
        let awayTeam = clubs.findBy('name', awayTeamName);

        let kickoff = new Date(fixture.kickoff.millis);

        let fixtureRecord = this.store.createRecord('fixture', {
          gameweek: gameweek,
          homeTeam: homeTeam,
          awayTeam: awayTeam,
          kickoff: kickoff,
        });

        fixtureRecord.gameweek = gameweek;
        fixtureRecord.homeTeam = homeTeam;
        fixtureRecord.awayTeam = awayTeam;
        fixtureRecord.kickoff = kickoff;
      });
    });
  }
}
