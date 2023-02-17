// // Function for preloading data
// // NOT USED

// let nbatest = {name: 'test', value: 'test'}

// let nbachoices = {name: 'test', value: 'test'}

// OLD NBA OPTIONS

// let nbaoptions = ['Atlanta', 'Boston', 'Brooklyn', 'Charlotte', 'Chicago', 'Cleveland', 'Dallas', 'Denver', 'Detroit',
// 'Golden State', 'Houston', 'Indiana', 'LA Clippers', 'LA Lakers', 'Memphis', 'Miami', 'Milwaukee', 'Minnesota', 'New Orleans',
// 'New York', 'Okla City', 'Orlando', 'Philadelphia', 'Phoenix', 'Portland', 'Portland', 'Sacramento', 'San Antonio', 'Toronto',
// 'Utah', 'Washington']

// let nbaoptions = { 
//    'Atlanta': 'ATL', 'Boston': 'BOS', 'Charlotte': 'CHA', 'Chicago': 'CHI', 'Cleveland': 'CLE',
//    'Dallas': 'DAL', 'Denver': 'DEN', 'Detroit': 'DET', 'Golden State': 'GSW', 'Houson': 'HOU',
//    'Indiana': 'IND', 'LA Clippers': 'LAC','LA Lakers': 'LAL','Memphis': 'MEM','Miami': 'MIA', 
//    'Milwaukee': 'MIL', 'Minnesota': 'MIN','New Orleans': 'NOP', 'New York': 'NYK', 'San Antonio': 'SAS', 
//    'Brooklyn': 'BKN', 'Okla City': 'OKC', 'Orlando': 'ORL', 'Philadelphia': 'PHI', 'Phoenix': 'PHX',
//    'Portland': 'POR', 'Sacramento': 'SAC', 'Toronto': 'TOR', 'Utah': 'UTA', 'Washington': 'WAS',
//  }
 
// SCRAPE FOR ALL GAMES CBS

// async function scrapeProductLoad() {
//     console.log('entry');
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     page.setDefaultNavigationTimeout(0);
//     await page.goto('https://www.cbssports.com/nba/expert-picks/'), {waitUntil: 'networkidle2'};
//     console.log('hi');
//     let texts = await page.evaluate(() => {
//         let data = []
//         let elements = document.getElementsByClassName('team');
//         for (let element of elements) {data.push(element.textContent.replace(/\W/gm, '').trimStart())}
//         return data
//     })
//     console.log('bye');
//     // CONVERT to matchups
//     let games = []
//     for (let i = 0; i < texts.length / 2; i++) {
//         // i * 2 and i * 2 + 1
//         games.push(texts[i*2] + ' v ' + texts[i*2+1])
//     }
//     await browser.close();
//     final = []
//     for (let i = 0; i < games.length; i++) {
//         final.push({name: games[i], value: games[i]})
//     }
//     nbatest = final;
//     console.log(nbatest);
//     return 'done';

// }

// Function for old commands
// var PREFIX = "!"

// client.on("messageCreate", async (msg) => {
//     //msg.reply('test')
//     if(!msg.content.startsWith(PREFIX))
//         return
//     let args = msg.content.substring(PREFIX.length).split(" ")
//     switch(args[0]) {
//         case "rank":
//             var string = msg.content.substring(6)
//             //msg.reply(await scrapeProduct('https://www.op.gg/summoners/na/' + string))
//             msg.reply(await scrapeProduct(string))
//             break
//         case "load":
//             msg.reply(await scrapeProductLoad())
//     }
// })



// OLD SCRAPE FUNCTIONS

 // let texts = await page.evaluate(() => {
    //     let data = []
    //     let elements = document.getElementsByClassName('odd');
    //     for (let element of elements) {data.push(element.textContent)}
    //     let data2 = []
    //     let elements2 = document.getElementsByClassName('even');
    //     for (let element of elements2) {data2.push(element.textContent)}
    //     finaldata = []
    //     for (let i = 0; i < data.length; i++) {
    //         finaldata.push(data[i].replace(/[\t\n]/gm, '').trimStart())
    //         finaldata.push(data2[i].replace(/[\t\n]/gm, '').trimStart())
    //     }
    //     return finaldata
    //     // let elements = document.getElementsByClassNAme('odd')
    //     // for (element of elements) {
    //     //   let str = element.textContent
    //     //   str = str.replace(/[\t\n]/gm, '').trimStart()
    //     //   if str.startsWith(away) -> get string
    //     //   if str.startsWith(home) -> get string
    //     // }
    // })



 // for (let i = 0; i < texts.length; i++) {
    //     if (texts[i].startsWith(away)) {
    //         let num = texts[i].indexOf('%')
    //         awaynum = Number(texts[i].substring(num-4, num))
    //         //JSON.stringify(texts[i].substring(num-4, num))
    //     }
    //     if (texts[i].startsWith(home)) {
    //         let num = texts[i].indexOf('%')
    //         homenum = Number(texts[i].substring(num-4, num))
    //         //return JSON.stringify(texts[i].substring(num-4, num))
    //     }
    // }





// NEW TEST TO SCRAPE FOR TEAMS USING ONE FUNCTION

// async function test() {
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage();
//     await page.goto('https://www.teamrankings.com/nba/trends/ats_trends/'/*, {timeout : 0}*/);
//     let texts = await page.evaluate(() => {
//         let texts = []
//         let elements3 = document.getElementsByClassName('tr-table datatable scrollable dataTable no-footer')
//         texts.push(elements3.length)
//         for (let element of elements3) {
//             texts.push(element.textContent.replace(/\W/gm, '').trim())
//         }
//         return JSON.stringify(texts)
//     })
//     let away = 'Atlanta'
//     let home = 'Orlando'
//     let news = texts[1].substring(24)
//     let data = []
//     for (let i = 0; i < 29; i++) {
//         console.log(i)
//         let num = news.match(/\d/).index
//         let num2 = news.substring(num).match('[a-zA-Z]').index
//         let str = news.substring(0, num + num2)
//         if (str.startsWith(away)) {
//             let num = str.match(/\d/).index
//             awaynum = Number(str.substring(num, num + 5))
//         }
//         if (str.startsWith(home)) {
//             let num = str.match(/\d/).index
//             homenum = Number(str.substring(num, num + 5))
//         }
//         news = news.substring(num + num2)
//     }
//     data.push(awaynum)
//     data.push(homenum)
//     await browser.close();
//     return JSON.stringify(data)
// }

// OLD FUNCTION FOR SCRAPE

// for (let vals of arr) {
    //     let str = vals.textContent.replace(/[\t\n]/gm, '').trimStart()
    //         if (str.startsWith(away)) {
    //             let num = str.indexOf('%')
    //             return Number(str.substring(num-4, num))
    //         }
    //         if (str.startsWith(home)) {
    //             let num = str.indexOf('%')
    //             homenum = Number(str.substring(num-4, num))
    //         }
    // }
    // return [awaynum, homenum]

// OLD SCRAPE

// for (let ele of list) {
        //     let str = ele.textContent.replace(/[\t\n]/gm, '').trimStart()
        //     if (str.startsWith(away)) {
        //         let num = str.indexOf('%')
        //         awaynum = Number(str.substring(num-4, num))
        //     }
        //     if (str.startsWith(home)) {
        //         let num = str.indexOf('%')
        //         homenum = Number(str.substring(num-4, num))
        //     }
        // }
        // list = document.getElementsByClassName('even')
        // for (let ele of list) {
        //     let str = ele.textContent.replace(/[\t\n]/gm, '').trimStart()
        //     if (str.startsWith(away)) {
        //         let num = str.indexOf('%')
        //         awaynum = Number(str.substring(num-4, num))
        //     }
        //     if (str.startsWith(home)) {
        //         let num = str.indexOf('%')
        //         homenum = Number(str.substring(num-4, num))
        //     }
        // }
