const { JSDOM } = require("jsdom");
const { getRequest } = require("../utils/requestHelper");
const { writeCSV } = require("../utils/csv");
const Spinnies = require("spinnies");
const start = async () => {
  const url = "https://news.ycombinator.com/";

  await writeCSV("hackerNews.csv", "Rank,Title,Website,Score,By,Age \n");

  const spinnies = new Spinnies();

  for (let page = 1; page !== -1; page++) {
    spinnies.add("page", { text: `Processing page number ${page}...` });

    const [error, response] = await request(`${url}?p=${page}`);

    if (error) throw error;

    const { data = "" } = response;

    await htmlToCsv(data);

    if (!hasNextPage(data)) {
      spinnies.add("page", { text: `Completed total page number ${page}` });

      break;
    }
  }
};

const request = async (url) => await getRequest(url, { retry: 5 });

const hasNextPage = (htmlString) => {
  const dom = new JSDOM(htmlString);

  const document = dom.window.document;

  const links = document.querySelectorAll("a");

  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    if (
      link.getAttribute("rel") === "next" &&
      link.textContent.trim() === "More"
    ) {
      return true;
    }
  }

  return false;
};

const htmlToCsv = async (html) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const rankElements = document.querySelectorAll("span.rank");
  const titleLinks = document.querySelectorAll("td.title span.titleline");
  const websiteElements = document.querySelectorAll("td.title span.sitestr");
  const scoreElements = document.querySelectorAll("span.score");
  const byElements = document.querySelectorAll("td.subtext a.hnuser");
  const ageElements = document.querySelectorAll("td.subtext span.age a");

  for (let index = 0; index < rankElements.length; index++) {
    const rank = rankElements[index]
      ? parseInt(rankElements[index].textContent)
      : null;
    const title = titleLinks[index]
      ? titleLinks[index].textContent.trim()
      : null;
    const website = websiteElements[index]
      ? websiteElements[index].textContent.trim()
      : null;
    const score = scoreElements[index]
      ? scoreElements[index].textContent.trim()
      : null;
    const by = byElements[index] ? byElements[index].textContent.trim() : null;
    const age = ageElements[index]
      ? ageElements[index].textContent.trim()
      : null;

    await writeCSV(
      "hackerNews.csv",
      `${rank},${title},${website},${score},${by},${age}\n`
    );
  }
};

module.exports = { start };
