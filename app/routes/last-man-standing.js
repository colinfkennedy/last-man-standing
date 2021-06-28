import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import rawFixtures from 'last-man-standing/data/fixtures';

export default class LastManStandingRoute extends Route {
  @service store;

  async model() {
    let clubs = await this.store.findAll('club');
    let babbers = await this.store.findAll('babber');

    let game = this.store.createRecord('game');
    this.parseRawFixtures(clubs);

    game.startGameweek = this.store.peekRecord('gameweek', 1);

    this.addDummyFixtureResults();

    this.addDummySelections(babbers, clubs);

    return {
      clubs: clubs,
      game: game,
      gameweeks: this.store.peekAll('gameweek'),
      selections: this.store.peekAll('selection'),
      babbers: babbers,
    };
  }

  addDummySelections(babbers, clubs) {
    let gameweek = this.store.peekRecord('gameweek', 1);
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

  }

  addDummyFixtureResults() {
    let gameweekOneFixtures = this.store.peekRecord('gameweek', 1).fixtures;

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
  }

  parseRawFixtures(clubs) {
    rawFixtures.pages.forEach((page) => {
      page.content.forEach((fixture) => {
        let gameweekId = fixture.gameweek.gameweek;
        let gameweek = this.store.peekRecord('gameweek', gameweekId);
        if (gameweek == null) {
          gameweek = this.store.createRecord('gameweek', {
            id: gameweekId,
          });
          gameweek.label = gameweekId;
        }

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
