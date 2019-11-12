const puppeteer = require('puppeteer');
const fs = require('fs');
const colors = require('colors');
const URL_LIST = 'https://bambolo.ru/goods/kostyum-soldata-8273.htm';
const URL_LIST1 = [{
    url: 'https://bambolo.ru/goods/kostyum-soldata-8273.htm',
    art_number: ''
},{
    url: 'https://bambolo.ru/goods/detskii-kostyum-ledi-bag-4286.htm',
    art_number: ''
}];
const batik = require('./lib/batik');
const { wfSync} = require('./modules/common');


async function openPage() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log(`Браузер открыт`.cyan);
    return await browser.newPage();
}

async function goToPage(page,url){
    console.log(`Переходим на страницу ${url}`.cyan);
    await page.goto(url,{
        waitUntil: 'networkidle2'
    });
    return page;
}

openPage().then(async (page)=>{

    let batik_bambolo = batik.reduce((acc,val)=>{
        if(val.bambolo !== null){
            acc.push({
                url: val.bambolo,
                art_number: val.art_number
            });
        }
        return acc;
    },[]);
    // console.log(JSON.stringify(batik_bambolo));

    let parsedData = URL_LIST1.reduce(async (acc,val)=>{
        await goToPage(page,val.url).then(async (page)=>{
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
                // wfSync(data,`./output/${+new Date()}.json`);
                acc.push(data)
            });
        });
        return acc;
    },[]);

    console.log('parserData: ',parsedData);

    // goToPage(page,URL_LIST).then(async (page)=>{
    //     console.log(`Страница посещена`.cyan);
    //     let data = {};
    //     return await page.evaluate(()=>{
    //         let title = document.querySelector('#breadcrumbs > li.last > a > span');
    //         let cost = document.querySelector('#rpart > div.priceblock > div.fl > div.price > span.d');
    //         title ? data.title = title.innerText : null;
    //         cost ? data.cost = cost.innerText.split(' ').join('')*1 : null ;
    //
    //         return data;
    //     }).then((data)=>{
    //         console.log(`Получены данные: ${JSON.stringify(data)}`.green)
    //         wfSync(data,`./output/${+new Date()}.json`);
    //     });
    // });

//
}).catch((e)=>{
    console.log(`Ошибка \n ${e}`)
});