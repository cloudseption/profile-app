const express = require('express');
const router = express.Router();
const Axios = require('axios');
const log = require('log4js').getLogger();

router.get('/', (req, res, next) => {
    const searchEndpoint    = process.env.SEARCH_ENDPOINT;
    const searchParams      = req.originalUrl.slice(req.originalUrl.indexOf('?'));
    const url               = searchEndpoint + searchParams;
    
    Axios.get(url, { headers: { 'Authorization' : process.env.SEARCH_TOKEN } })
    .then((result) => {
        let data = result.data;
        log.info(data);
        res.status(200).json(data);
    })
    .catch((err) => {
        log.error(err);
        res.status(500).json([]);
    });
});

module.exports = router;