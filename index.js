const puppeteer = require('puppeteer');
const fs = require('fs');
const colors = require('colors');
const URL = 'https://bambolo.ru/goods/kostyum-soldata-8273.htm';
let batik = require('./lib/batik');

async function openPage() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log(`Браузер открыт`.cyan);
    return await browser.newPage();
}

async function goToPage(page,url){
    console.log(`Переходим на страницу ${URL}`.cyan);
    await page.goto(URL);
    return page;
}

openPage().then(async (page)=>{

    let batik_bambolo = batik.reduce((acc,val)=>{
        console.log(acc)
        if(val.bambolo){
            acc.push({
                url: val.bambolo,
                art_number: val.art_number
            });
            return acc;
        }
    },[]);
    console.log(JSON.stringify(batik_bambolo));

    goToPage(page,URL).then(async (page)=>{
        console.log(`Страница посещена`.cyan);
        let data = {};
        return await page.evaluate(()=>{
            let title = document.querySelector('#breadcrumbs > li.last > a > span');
            let cost = document.querySelector('#rpart > div.priceblock > div.fl > div.price > span.d');
            title ? data.title = title.innerText : null;
            cost ? data.cost = cost.innerText.split(' ').join('')*1 : null ;

            return data;
        }).then((data)=>{
            console.log(`Получены данные: ${JSON.stringify(data)}`.green)
        });
    });

//
}).catch((e)=>{
    console.log(`Ошибка \n ${e}`)
});