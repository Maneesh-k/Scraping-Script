const { Router } = require("express");
const scraping = require("../service/scraping")
const HackerNews = require("../service/hackerNews")

const route = Router()

route.get("/scraping", async (req, res) => {

    const {page = 1} = req.query

    const cache =  HackerNews.getData(page)

    if(cache) return res.status(200).json(cache)
    
    const hackerNews = await scraping.start(page)

    HackerNews.setData(page,hackerNews)

    return res.status(200).json(hackerNews)
})

module.exports = { route }