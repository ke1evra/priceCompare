const puppeteer = require('puppeteer');
const colors = require('colors');

const { wfSync } = require('./common');

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
            console.log('Ошибка в функции scrapeBamboloPage'.red);
            console.log(e)
        }
    }

    async scrapeMyCarnavalPage(page){
        try {
            return await page.evaluate(()=>{
                let data = {};
                let title = document.querySelector('h1');
                let cost = document.querySelector('#main_buy_form > div.buy__prices > div > div.buy__price > span');

                title ? data.title = title.innerText : null;
                cost ? data.cost = cost.innerText.split(' ').join('')*1 : null;

                return data;
            })
        }catch (e) {
            console.log('Ошибка в функции scrapeBamboloPage'.red);
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

    async checkUnfinishedJob(){

    }

    async parseData(scrapeFunc){
        let data = [];
        try {
            let newPage = await this.openPage();
            for(let item of this.inputFile){
                let loadedPage = await this.goToPage(newPage,item.url);
                let parsedData = await scrapeFunc(loadedPage);
                data.push(parsedData);
                data[data.length-1].art_number = item.art_number;
                console.log(`Получены данные: ${JSON.stringify(parsedData)}`.green);
            }
            await this.saveResult(data);
            return data;
        }catch (e) {
            console.log('Ошибка в функции parseData'.red);
            console.log(e);
            return data;
        }
    }

    async parseBamboloData(){
        let data = [];
        try {
            data = this.parseData(this.scrapeBamboloPage);
            return data;
        }catch (e) {
            console.log('Ошибка в функции parseBamboloData'.red);
            console.log(e);
            return data;
        }
    }

    async parseMyCarnavalData(){
        let data = [];
        try {
            data = this.parseData(this.scrapeMyCarnavalPage);
            return data;
        }catch (e) {
            console.log('Ошибка в функции parseBamboloData'.red);
            console.log(e);
            return data;
        }
    }
}

module.exports = Parser;
