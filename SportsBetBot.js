// Initialize dotenv
// Cover the Spread ID: 849012503799267339
// Priavte ID: 774954355622281217
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const puppeteer = require('puppeteer');
const { SlashCommandBuilder } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const settings = require('./settings.json');
const { token } = require('./config.json');
const {AttachmentBuilder, EmbedBuilder } = require('discord.js');
const teamColors = require(`./colors.json`);

let nbaoptions = settings.nbaoptions

let gamesobjs = []

async function start() {
    let games = await getNBAGames()
    for (let i = 0; i < games.length; i++) {
        let num = games[i].indexOf(':')
        gamesobjs[i] = {name: JSON.stringify(games[i].substring(0, num)).replace(/"|'/g, ''), value: JSON.stringify(games[i].substring(num+2)).replace(/"|'/g, '')}
    }
    let nbaCommand = new SlashCommandBuilder()
    .setName('nbabet')
    .setDescription('NBA Prediction Generator')
    .addStringOption(option => {
        option.setName('game')
            .setDescription('Pick a game')
            .setRequired(true)

            for (let i = 0; i < gamesobjs.length; i++){
                option.addChoices({name: gamesobjs[i].name, value: gamesobjs[i].name})
            }
            return option
        }
    )

    commands = [
        nbaCommand,
        new SlashCommandBuilder().setName('nbagames').setDescription("Check today's NBA lines"),
    ].map(command => command.toJSON())
    return commands
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
		const {commandName} = interaction
        switch (commandName) {
            case 'nbabet':
                await interaction.deferReply();
                let str = interaction.options.getString('game')
                let favorite = gamesobjs.find(obj => {
                    return obj.name === str
                  }).value.substring(0,3)
                let away = nbaoptions[interaction.options.getString('game').substring(0,3)]
                let home = nbaoptions[interaction.options.getString('game').substring(6)]
                favorite = nbaoptions[favorite]
                let res = await betPrediction(away, home, favorite)
                let teamcode = Object.keys(nbaoptions).find(key => nbaoptions[key] == res)
                const attachment = new AttachmentBuilder("../testbot/logos/" + teamcode + ".png")
                const embed = new EmbedBuilder()
                        .setColor(teamColors[teamcode])
                        .setTitle(JSON.stringify(away + ' v ' + home + '. Bet on ' + res))
                        .setImage('attachment://' + teamcode + ".png");
                interaction.followUp({embeds: [embed], files: [attachment]});
                break;
            case 'nbagames':
                await interaction.deferReply();
                let games = await getNBAGames()
                var gamesobj = []
                for (let i = 0; i < games.length; i++) {
                    let num = games[i].indexOf(':')
                    gamesobj[i] = {name: JSON.stringify(games[i].substring(0, num)).replace(/"|'/g, ''), 
                        value: JSON.stringify(games[i].substring(num+2)).replace(/"|'/g, '')}
                }
                let embedgames = new EmbedBuilder()
                        .setTitle('Games Today')
                        .addFields(gamesobj)
                interaction.followUp({embeds: [embedgames]})
                break;
        }
});


async function betPrediction(away, home, favorite) {
    // CALL FOR FIRST WEBSITE
    let [awaynum, homenum] = await scrapeSite('https://www.teamrankings.com/nba/trends/ats_trends/?sc=all_games', away, home)
    // CALL FOR AWAYTEAM
    let [awayaway, homeaway] = await scrapeSite('https://www.teamrankings.com/nba/trends/ats_trends/?sc=is_away', away, home)
    // CALL FOR HOMETEAM
    let [awayhome, homehome] = await scrapeSite('https://www.teamrankings.com/nba/trends/ats_trends/?sc=is_home', away, home)
    // CALL FOR FAVORITE
    let [awayfav, homefav] = await scrapeSite('https://www.teamrankings.com/nba/trends/ats_trends/?sc=is_fav', away, home)
    // CALL FOR UNDERDOG
    let [awaydog, homedog] = await scrapeSite('https://www.teamrankings.com/nba/trends/ats_trends/?sc=is_dog', away, home)
    // Calculat differece, return winner and CODE
    // Formula for AWAY: ORIG + (awayaway - awayhome) + (awayfav - awaydog) <- figure out if dog or fav then swap
    console.log(awaynum, homenum, awayaway, homeaway, awayhome, homehome, awayfav, homefav, awaydog, homedog)
    if (away == favorite) {
        awaynum += (awayaway - awayhome) + (awayfav - awaydog)
        homenum += (homehome - homeaway) + (homedog - homefav)
    }
    // HOME IS FAV
    else {
        awaynum += (awayaway - awayhome) + (awaydog - awayfav)
        homenum += (homehome - homeaway) + (homefav - homedog)
    }
    if (awaynum - homenum > 0) {
        return away
    }
    else {
        return home
    }

}

async function getNBAGames() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.goto('https://www.rotowire.com/basketball/nba-lineups.php');
    let [matchups, lines] = await page.evaluate(() => {
        
        let matches = []
        let list = document.getElementsByClassName('lineup__teams')
        for (let ele of list) {
            matches.push(ele.textContent.replace(/\W/gm, '').trim())
        }
        let line = []
        list = document.getElementsByClassName('fanduel hide')
        for (let ele of list) {
            line.push(ele.textContent)
        }
        return [matches, line]
    })
    await browser.close();
    for (let i = 0; i < matchups.length; i++) {
        JSON.stringify(matchups[i])
        matchups[i] = matchups[i].substring(0,3) + ' v ' + matchups[i].substring(3) + ': ' + lines[3*i + 1]
    }
    return (matchups)
}

async function scrapeSite(site, away, home) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.goto(site);
    let [awayres, homeres] = await page.evaluate((away, home) => {
        let awaynum = homenum = 0
        let teamList = document.getElementsByClassName('nowrap')
        let spreadList = [...document.getElementsByClassName('text-right green sorting_1'), 
            ...document.getElementsByClassName('text-right sorting_1')]
        let buffer = Object.keys(spreadList).length - 30
        for (let i = 4; i < Object.keys(teamList).length; i++) {
            if (teamList[i].textContent.startsWith(away)) {
                awaynum = Number(spreadList[i-4+buffer].textContent.slice(0, -1))
            }
            if (teamList[i].textContent.startsWith(home)) {
                homenum = Number(spreadList[i-4+buffer].textContent.slice(0, -1))
            }
        }
        let x = typeof spreadList
        return [awaynum, homenum]
    }, away, home)
    await browser.close();
    return [awayres, homeres]
}

client.on('ready', async() => {
    const rest = new REST({ version: '9' }).setToken(token)

    let commands = await start()
    rest.put(Routes.applicationGuildCommands(settings.clientId, settings.serverId), { body: commands })
        .then(() => console.log("Successfully registered application commands."))
        .catch(console.error)

    console.log(`Logged in as ${client.user.tag}!`);
   });
   
    // Log In our bot
    client.login(token);