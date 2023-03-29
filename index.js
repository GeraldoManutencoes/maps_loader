// Link padrão do google maps:
// https://www.google.com.br/maps/search/igrejas+em+roncador/
//                                            ^- Trocar cidade com base no IP

// node index.js --shm-size=1gb
// Use this to run this code pls man otherwise it won't work yeyyyyyyyy


const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.get("/:loc", async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Go to your site
    await page.goto(`https://www.google.com.br/maps/search/igrejas+em+${req.params.loc}/`);

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