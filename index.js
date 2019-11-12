const puppeteer = require('puppeteer');
const fs = require('fs');
const colors = require('colors');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: ()=>{return `./output/${+new Date()}`},
});

const batik = require('./lib/batik');
const { wfSync } = require('./modules/common');

let batik_bambolo = batik.reduce((acc,val)=>{
    if(val.bambolo !== null){
        acc.push({
            url: val.bambolo,
            art_number: val.art_number
        });
    }
    return acc;
},[]);


async function openPage() {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log(`Браузер открыт`.cyan);
        return await browser.newPage();
    }catch (e) {
        console.log('Ошибка в функции openPage');
        console.log(e)
    }

}

async function goToPage(page,url){
    try {
        console.log(`Переходим на страницу ${url}`.cyan);
        await page.goto(url,{
            waitUntil: 'networkidle2'
        });
        return page;
    }catch (e) {
        console.log('Ошибка в функции goToPage');
        console.log(e)
    }

}

async function scrape(page){
    try {
        return await page.evaluate(()=>{
            let data = {};
            let title = document.querySelector('#breadcrumbs > li.last > a > span');
            let cost = document.querySelector('#rpart > div.priceblock > div.fl > div.price > span.d');
            title ? data.title = title.innerText : null;
            cost ? data.cost = cost.innerText.split(' ').join('')*1 : null ;

            return data;
        })
    }catch (e) {
        console.log('Ошибка в функции scrape');
        console.log(e)
    }

}

async function saveResult(data){
    try {

        wfSync(data,`./output/${+new Date()}.json`);
        console.log(`Файл сохранен`.cyan);

        csvWriter
            .writeRecords(data)
            .then(()=> console.log('The CSV file was written successfully'));
    }catch (e) {
        console.log('Ошибка в функции saveResult');
        console.log(e)
    }

}

async function main(){
    let newPage = await openPage();
    let data = [];

    for(let item of batik_bambolo){
        let loadedPage = await goToPage(newPage,item.url);
        data.push(await scrape(loadedPage));
        data[data.length-1].art_number = item.art_number;
        console.log(`Получены данные: ${JSON.stringify(data)}`.green)
    }
    return data;
}
(async ()=>{
    try{
        let data = await main();
        await saveResult(data)
    }
    catch (e) {
        console.log(e)
    }
})();