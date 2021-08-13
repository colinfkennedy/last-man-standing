import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import firebase from 'firebase/app';
import 'firebase/storage';
import fetch from 'fetch';
import { isPresent } from '@ember/utils';

const fixturesFile = 'gs://babb-last-man-standing-fixtures/fixtures.json';

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
      rawFixtures: this.getRawFixtures(),
    });
  }

  // eslint-disable-next-line no-unused-vars
  afterModel(model) {
    let clubs = this.store.peekAll('club');
    let gameweeks = this.store.peekAll('gameweek');

    this.parseRawFixtures(clubs, gameweeks, model.rawFixtures);
  }

  @action
  loading() {
    return true; // allows the loading template to be shown
  }

  async getRawFixtures() {
    // Create a reference with an initial file path and name
    let storage = firebase.storage();

    let fixturesFileReference = storage.refFromURL(fixturesFile);

    let fixturesDownloadUrl = await fixturesFileReference.getDownloadURL();

    return fetch(fixturesDownloadUrl)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  parseRawFixtures(clubs, gameweeks, rawFixtures) {
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

        let goals = fixture.goals;

        let homeScore = fixture.teams[0].score;
        let awayScore = fixture.teams[1].score;

        let fixtureRecord = this.store.createRecord('fixture', {
          gameweek: gameweek,
          homeTeam: homeTeam,
          awayTeam: awayTeam,
          kickoff: kickoff,
          homeScore: homeScore,
          awayScore: awayScore,
        });

        fixtureRecord.gameweek = gameweek;
        fixtureRecord.homeTeam = homeTeam;
        fixtureRecord.awayTeam = awayTeam;
        fixtureRecord.kickoff = kickoff;
        fixtureRecord.homeScore = homeScore;
        fixtureRecord.awayScore = awayScore;
      });
    });
  }
}
