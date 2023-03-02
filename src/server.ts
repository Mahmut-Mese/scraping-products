import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import fs from 'fs';
import http from 'http';

const app = express();
const corsOptions ={
    origin: '*', 
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://wltest.dns-systems.net/');

    const element = await page.evaluate(() => {
        const listItem = document.querySelectorAll('.package');
        let listArray = <any>[];
        listItem.forEach((item) => {
            const header = item.querySelector<HTMLElement>('h3')!.innerText;
            const liItem = item.querySelectorAll<HTMLElement>('.package-features ul li');
            const description = liItem[0];
            const price = liItem[2].querySelectorAll<HTMLElement>('span')[0].innerText;
            const discount = liItem[2].querySelectorAll<HTMLElement>('p')[0]?.innerText;

            const monthYear = liItem[2].querySelectorAll<HTMLElement>('.package-price')[0]?.innerText;
            const month = monthYear?.split(' ').splice(-1)[0];
            const priceYear = parseFloat(price?.substring(1)) * 12;
            const priceWithPoundSign = '£' + priceYear?.toFixed(2);
            const check = month === 'Month' ? priceWithPoundSign : price;
            listArray.push({
                header: header,
                description: description.innerText,
                price: check,
                discount: discount,
            });
        });
          

        listArray.sort(function(a: any, b: any) {
            const priceA = parseFloat(a.price?.substring(1));
            const priceB = parseFloat(b.price?.substring(1));
            return priceB - priceA;
        });

        return listArray;
    });

    fs.writeFileSync('data.json', JSON.stringify(element));
    await browser.close();
})();

const server = http.createServer((req: any, res: any) => {
    if (req.url === '/' && req.method === 'GET') {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
                return;
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

server.listen(8000, () => {
    console.log('Server is listening on port 8000');
});
