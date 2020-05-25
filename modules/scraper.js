const puppeteer = require('puppeteer');
const colors = require('colors');

const { wfSync } = require('./common');

const batik = require('../lib/batik');

let batik_bambolo = batik.reduce((acc,val)=>{
    if(val.bambolo !== null){
        acc.push({
            url: val.bambolo,
            art_number: val.art_number
        });
    }
    return acc;
},[]);

class Parser {
    constructor(inputFile) {
        this.inputFile = inputFile;
    }

    async openPage(){
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            console.log(`Браузер открыт`.cyan);
            return await browser.newPage();
        }catch (e) {
            console.log('Ошибка в функции openPage'.red);
            console.log(e)
        }
    }

    async goToPage(page,url){
        try {
            console.log(`Переходим на страницу ${url}`.cyan);
            await page.goto(url,{
                waitUntil: 'networkidle2'
            });
            return page;
        }catch (e) {
            console.log('Ошибка в функции goToPage'.red);
            console.log(e)
        }
    }

    async scrapeBamboloPage(page){
        try {
            return await page.evaluate(()=>{
                let data = {};
                let title = document.querySelector('#breadcrumbs > li.last > a > span');
                let cost = document.querySelector('#rpart > div.priceblock > div.fl > div.price > span.d');

                title ? data.title = title.innerText : null;
                cost ? data.cost = cost.innerText.split(' ').join('')*1 : null;

                return data;
            })
        }catch (e) {
            console.log('Ошибка в функции scrape'.red);
            console.log(e)
        }
    }

    async saveResult(data){
        try {
            wfSync(data,`./output/${+new Date()}.json`);
            console.log(`Файл сохранен`.cyan);
        }catch (e) {
            console.log('Ошибка в функции saveResult'.red);
            console.log(e)
        }
    }

    async parseBamboloData(){
        let data = [];
        try {
            let newPage = await this.openPage();


            for(let item of batik_bambolo){
                let loadedPage = await this.goToPage(newPage,item.url);
                let parsedData = await this.scrapeBamboloPage(loadedPage);
                data.push(parsedData);
                data[data.length-1].art_number = item.art_number;
                console.log(`Получены данные: ${JSON.stringify(parsedData)}`.green);
            }
            await this.saveResult(data);
            return data;
        }catch (e) {
            console.log('Ошибка в функции parseBamboloData'.red);
            console.log(e);
            return data;
        }
    }



}

module.exports = Parser;
