const scraper = require('./modules/scraper');
const rubies = require('./lib/rubies');

let rubies_mycarnaval = rubies.reduce((acc,val)=>{
    if(val['my-carnaval'] !== null){
        acc.push({
            url: val['my-carnaval'],
            art_number: val.art_number
        });
    }
    return acc;
},[]);

const mycarnavalScraper = new scraper(rubies_mycarnaval);
console.log('Погнали'.cyan)
let data = mycarnavalScraper.parseMyCarnavalData();

