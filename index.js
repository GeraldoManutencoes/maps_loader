// Link padrão do google maps:
// https://www.google.com.br/maps/search/igrejas+em+roncador/
//                                            ^- Trocar cidade com base no IP

// node index.js --shm-size=1gb
// Use this to run this code pls man otherwise it won't work yeyyyyyyyy



// Api to covert location to adress:
// https://api.geoapify.com/v1/geocode/reverse?lat=lat_here&lon=-lon_here&format=json&apiKey=dd815f66df4c40e8aa70bcd2e2c77e23
// Plese don't steal it man, i'm lazy asf to find a way to hide it
const fetch = require("node-fetch");
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const getLoc = async (lat, lon) => {
    const req = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=dd815f66df4c40e8aa70bcd2e2c77e23`);
    const res = await req.json();
    return res.results[0].city;
}

app.get("/:lat/:lon", async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let loc = await getLoc(req.params.lat, req.params.lon);
    await page.goto(`https://www.google.com.br/maps/search/igrejas+em+${loc}/`);

    const data = await page.evaluate(() => {
        return {
            churches: [...document.querySelectorAll(".qBF1Pd")].map(x => x.innerHTML),
            rating: [...document.querySelectorAll(".MW4etd")].map(x => x.innerHTML),
        }
        }
    )
    await browser.close();
    res.send(data);
})

app.listen("8080", () => console.log("Running"));