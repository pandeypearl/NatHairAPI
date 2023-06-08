#!/usr/bin/node
// File tp scrape data for product API

const PORT = process.env.PORT || 8000
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const app = express();
const router = express.Router();
const cors = require('cors');
app.use(cors());

router.get('/', function(_req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// website being scraped
url = 'https://www.cosmeticconnection.co.za/collections/hair-care-product-category'

// Async Function to scrape data from url and save data as JSON content 
app.get('/products', (_req, res) => {
    axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const products = []

            $('.inner-top', html).each(function () {
                const brand = $(this).find('.col-prod .product-vendor a').text()
                const title = $(this).find('.col-prod .product-title span').text()
                const url = $(this).find('.col-prod .product-title').attr('href')
                const image = $(this).find('.col-img .product-top .product-image a img').attr('src')
                const price = $(this).find('.col-price .price-box .price-regular span').text()
                products.push({
                    brand,
                    title,
                    url,
                    image,
                    price
                })
            })
            res.json(products)
        }).catch((err) => console.log(err))
})

app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log('server running on PORT ${PORT}'))