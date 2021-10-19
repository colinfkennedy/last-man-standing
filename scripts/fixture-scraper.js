const puppeteer = require('puppeteer');
const fs = require('fs');
const { format } = require('date-fns');
const fixturesApiUrl = 'https://footballapi.pulselive.com/football/fixtures';
const resultsUrl = 'https://www.premierleague.com/results';

const fixturePromises = [];

function retreiveJsonPromise(response) {
  if (response.url().startsWith(fixturesApiUrl)) {
    console.log('Processing fixture response url:', response.url());
    fixturePromises.push(response.json());
    console.log('Fixture promises', fixturePromises);
  }
}

function modifyFixtureQueryParams(request) {
  if (request.url().startsWith(fixturesApiUrl)) {
    console.log(`Intercepted fixture url: ${request.url()}`);
    let url = `${fixturesApiUrl}?comps=1&compSeasons=418&teams=1,2,130,131,43,4,6,7,9,26,10,11,12,23,14,20,21,33,25,38&page=0&pageSize=500&sort=asc&statuses=C,U,L&altIds=true`;
    request.continue({ url });
  } else {
    request.continue();
  }
}

async function getGameweekData(page, url) {
  console.log(`Processing ${url}`);
  await page.goto(url, { waitUntil: 'networkidle0' });
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  await page.setDefaultNavigationTimeout(180000);

  page.on('request', modifyFixtureQueryParams);
  page.on('response', retreiveJsonPromise);
  page.on('console', (consoleObj) => console.log(consoleObj.text()));

  await getGameweekData(page, resultsUrl);
  console.log(`Finished ${resultsUrl}`);

  let fixtureJson = await Promise.all(fixturePromises);
  let fixtureFile = {
    pages: fixtureJson,
  };
  console.log('Fixtures JSON: ', fixtureJson);

  fs.writeFile(
    `./fixtures-${format(new Date(), 'yyyy-MM-dd').toString()}.json`,
    JSON.stringify(fixtureFile, null, 3),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Wrote fixtures');
    }
  );

  await browser.close();
})();
