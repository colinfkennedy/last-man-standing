const puppeteer = require('puppeteer');
const fs = require('fs');
const { format } = require('date-fns');
const fixturesUrl = 'https://www.premierleague.com/fixtures';
const fixturesApiUrl = 'https://footballapi.pulselive.com/football/fixtures';
const resultsUrl = 'https://www.premierleague.com/results';

const fixturePromises = [];

function retreiveJsonPromise(response) {
  if (response.url().startsWith(fixturesApiUrl)) {
    console.log('Response url:', response.url());
    fixturePromises.push(response.json());
    console.log('Fixture promises', fixturePromises);
  }
}

async function getGameweekData(page, url) {
  await page.goto(url);
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  await autoScroll(page);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('response', retreiveJsonPromise);

  await getGameweekData(page, resultsUrl);
  await getGameweekData(page, fixturesUrl);

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

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
