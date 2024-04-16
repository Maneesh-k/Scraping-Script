const { JSDOM } = require("jsdom");
const { getRequest } = require("../utils/requestHelper");
const Spinnies = require("spinnies");

const start = async (page) => {
  const url = "https://news.ycombinator.com/";

  const [error, response] = await request(`${url}?p=${page}`);

  if (error) throw new Error(error);

  const { data = "" } = response;

  const hackerNews = htmlToArray(data);

  const hasNextPage = nextPage(data);

  return { data: hackerNews, hasNextPage };
};

const request = async (url) => await getRequest(url, { retry: 5 });

const nextPage = (htmlString) => {
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

const htmlToArray = (html) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const rankElements = document.querySelectorAll("span.rank");
  const titleLinks = document.querySelectorAll("td.title span.titleline");
  const websiteElements = document.querySelectorAll("td.title span.sitestr");
  const scoreElements = document.querySelectorAll("span.score");
  const byElements = document.querySelectorAll("td.subtext a.hnuser");
  const ageElements = document.querySelectorAll("td.subtext span.age a");

  const currentPageHackerNews = [];

  const spinnies = new Spinnies();

  for (let index = 0; index < rankElements.length; index++) {
    spinnies.add("news", { text: `Processing news number ${index}...` });

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

    currentPageHackerNews.push({
      rank,
      title,
      website,
      score,
      by,
      age,
    });
  }

  return currentPageHackerNews;

};

module.exports = { start };
