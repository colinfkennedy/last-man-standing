import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import rawFixtures from 'last-man-standing/data/fixtures';
import RSVP from 'rsvp';

export default class LastManStandingRoute extends Route {
  @service store;

  model() {
    return RSVP.hash({
      clubs: this.store.findAll('club'),
      babbers: this.store.findAll('babber'),
      gameweeks: this.store.findAll('gameweek'),
      games: this.store.findAll('game'),
    });
  }

  afterModel(model) {
    // let { clubs, babbers, gameweeks } = model;

    let clubs = this.store.peekAll('club');
    let babbers = this.store.peekAll('babber');
    let gameweeks = this.store.peekAll('gameweek');

    this.parseRawFixtures(clubs, gameweeks);

    this.addDummyFixtureResults(gameweeks);

    this.addDummySelections(babbers, clubs, gameweeks);
  }

  addDummySelections(babbers, clubs, gameweeks) {
    let gameweek = gameweeks.findBy('label', '1');
    let manUnited = clubs.findBy('name', 'Manchester United');
    let arsenal = clubs.findBy('name', 'Arsenal');
    let brighton = clubs.findBy('name', 'Brighton and Hove Albion');
    let chelsea = clubs.findBy('name', 'Chelsea');
    let babber1 = babbers.objectAt(0);
    let selectionRecord1 = this.store.createRecord('selection');
    selectionRecord1.babber = babber1;
    selectionRecord1.club = manUnited;
    selectionRecord1.gameweek = gameweek;

    let babber2 = babbers.objectAt(1);
    let selectionRecord2 = this.store.createRecord('selection');
    selectionRecord2.babber = babber2;
    selectionRecord2.club = arsenal;
    selectionRecord2.gameweek = gameweek;

    let babber3 = babbers.objectAt(2);
    let selectionRecord3 = this.store.createRecord('selection');
    selectionRecord3.babber = babber3;
    selectionRecord3.club = brighton;
    selectionRecord3.gameweek = gameweek;

    let babber4 = babbers.objectAt(3);
    let selectionRecord4 = this.store.createRecord('selection');
    selectionRecord4.babber = babber4;
    selectionRecord4.club = chelsea;
    selectionRecord4.gameweek = gameweek;

    let babber5 = babbers.objectAt(4);
    let selectionRecord5 = this.store.createRecord('selection');
    selectionRecord5.babber = babber5;
    selectionRecord5.club = chelsea;
    selectionRecord5.gameweek = gameweek;

    let gameweek2 = gameweeks.findBy('label', '2');
    let liverpool = clubs.findBy('name', 'Liverpool');
    let burnley = clubs.findBy('name', 'Burnley');
    let joe = babbers.findBy('name', 'Joe');
    let paddy = babbers.findBy('name', 'Paddy');

    let selectionRecordGw2Joe = this.store.createRecord('selection');
    selectionRecordGw2Joe.babber = joe;
    selectionRecordGw2Joe.club = liverpool;
    selectionRecordGw2Joe.gameweek = gameweek2;

    let selectionRecordGw2Paddy = this.store.createRecord('selection');
    selectionRecordGw2Paddy.babber = paddy;
    selectionRecordGw2Paddy.club = burnley;
    selectionRecordGw2Paddy.gameweek = gameweek2;
  }

  addDummyFixtureResults(gameweeks) {
    let gameweekOneFixtures = gameweeks.findBy('label', '1').fixtures;

    gameweekOneFixtures.objectAt(0).homeScore = 3;
    gameweekOneFixtures.objectAt(0).awayScore = 0;

    gameweekOneFixtures.objectAt(1).homeScore = 1;
    gameweekOneFixtures.objectAt(1).awayScore = 2;

    gameweekOneFixtures.objectAt(2).homeScore = 2;
    gameweekOneFixtures.objectAt(2).awayScore = 1;

    gameweekOneFixtures.objectAt(3).homeScore = 0;
    gameweekOneFixtures.objectAt(3).awayScore = 0;

    gameweekOneFixtures.objectAt(4).homeScore = 0;
    gameweekOneFixtures.objectAt(4).awayScore = 0;

    gameweekOneFixtures.objectAt(5).homeScore = 0;
    gameweekOneFixtures.objectAt(5).awayScore = 0;

    gameweekOneFixtures.objectAt(6).homeScore = 1;
    gameweekOneFixtures.objectAt(6).awayScore = 1;

    gameweekOneFixtures.objectAt(7).homeScore = 0;
    gameweekOneFixtures.objectAt(7).awayScore = 0;

    gameweekOneFixtures.objectAt(8).homeScore = 0;
    gameweekOneFixtures.objectAt(8).awayScore = 0;

    gameweekOneFixtures.objectAt(9).homeScore = 3;
    gameweekOneFixtures.objectAt(9).awayScore = 3;

    let gameweekTwoFixtures = gameweeks.findBy('label', '2').fixtures;

    gameweekTwoFixtures.objectAt(0).homeScore = 1;
    gameweekTwoFixtures.objectAt(0).awayScore = 0;
  }

  parseRawFixtures(clubs, gameweeks) {
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
