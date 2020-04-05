const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

var data = require('novelcovid');

var usercountry = "";
var userstate = "";

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    var msg = message.content.toLowerCase();
    
    if (msg.startsWith(`${prefix}stats`)) {
        data.getAll().then(statsResult);
    } else if (msg.startsWith(`${prefix}countrylist`)) {
        data.getCountry().then(listResult);
    } else if (msg.startsWith(`${prefix}country `)) {
        data.getCountry().then(countryResult);
        usercountry = message.content;
    } else if (msg.startsWith(`${prefix}state `)) {
        data.getState().then(stateResult);
        userstate = message.content;
    } else if (msg.startsWith(`${prefix}help`)) {
        help();
    } else if (msg.startsWith(`${prefix}`)) {
        idk();
    }

    function statsResult(result) {
        var casesEmbed = new Discord.MessageEmbed()
            .setTitle("Global Dashboard")
            .setThumbnail("https://i.ibb.co/5Fx8LQw/Real-COVID-19-Virus.png")
            .addFields(
                { name: "Cases", value: result.cases, inline: true },
                { name: "Deaths", value: result.deaths, inline: true },
                { name: "Recovered", value: result.recovered, inline: true },
            )
            .setFooter("Last Updated: " + new Date(result.updated).toLocaleString() + ", Coordinated Universal Time")
        message.channel.send(casesEmbed);
    }
    function listResult(result) {
        var countrieslist = [];
        for (i = 0; i < result.length; i++) {
            countrieslist.push(result[i].country);
        }
        
        for (var i = 0; i < countrieslist.length; i++){
            countrieslist[i] = "`" + countrieslist[i] + "`";
        }
        
        var topcountries = countrieslist.splice(0, 51);
        topcountries = topcountries.toString();

        var countrylist = new Discord.MessageEmbed()
            .setTitle("Hot COVID-19 Countries")
            .setThumbnail("https://charlesaris.com/wp-content/uploads/2016/12/countries-globe.png")
            .addFields(
                { name: "Countries with Most Cases", value: topcountries, inline: false },
            )
        message.channel.send(countrylist);
    }
    function countryResult(result) {
        var cases = [];
        var countries = [];
        var deaths = [];
        var recovered = [];
        var flag = [];
        var casestoday = [];
        var deathstoday = [];
        var entity = "country ";

        var statsindex = 0;
        
        var saidcountry = usercountry.slice(prefix.length + entity.length);
        saidcountry = saidcountry[0].toUpperCase() + saidcountry.slice(1);

        if (saidcountry == "Usa" || saidcountry == "United states" || saidcountry == "United states of america" || saidcountry == "US" || saidcountry == "Us") {
            saidcountry = "USA";
        }

        for (i = 0; i < result.length; i++) {
            cases.push(result[i].cases);
        }
        for (i = 0; i < result.length; i++) {
            deaths.push(result[i].deaths);
        }
        for (i = 0; i < result.length; i++) {
            recovered.push(result[i].recovered);
        }
        for (i = 0; i < result.length; i++) {
            countries.push(result[i].country);
        }
        for (i = 0; i < result.length; i++) {
            flag.push(result[i].countryInfo.flag);
        }
        for (i = 0; i < result.length; i++) {
            casestoday.push(result[i].todayCases);
        }
        for (i = 0; i < result.length; i++) {
            deathstoday.push(result[i].todayDeaths);
        }
        
        if (countries.includes(saidcountry)) {
            statsindex = countries.indexOf(saidcountry);
            if (flag[statsindex] == "https://raw.githubusercontent.com/NovelCOVID/API/master/assets/flags/unknow.png") {
                var flagfail = new Discord.MessageEmbed()
                    .setTitle(saidcountry + " Dashboard")
                    .addFields(
                        { name: "Cases", value: cases[statsindex] + " (+" + Math.round(1000*casestoday[statsindex]/cases[statsindex])/10 + "%)", inline: true },
                        { name: "Deaths", value: deaths[statsindex] + " (+" + Math.round(1000*deathstoday[statsindex]/deaths[statsindex])/10 + "%)", inline: true },
                        { name: "Recovered", value: recovered[statsindex], inline: true },

                    )
                message.channel.send(flagfail);
            } else {
                var inputCountry = new Discord.MessageEmbed()
                    .setTitle(saidcountry + " Dashboard")
                    .setThumbnail(flag[statsindex])
                    .addFields(
                        { name: "Cases", value: cases[statsindex] + " (+" + Math.round(1000*casestoday[statsindex]/cases[statsindex])/10 + "%)", inline: true },
                        { name: "Deaths", value: deaths[statsindex] + " (+" + Math.round(1000*deathstoday[statsindex]/deaths[statsindex])/10 + "%)", inline: true },
                        { name: "Recovered", value: recovered[statsindex], inline: true }
                    )
                message.channel.send(inputCountry);
            }
        } else {
            message.channel.send(`Whoa there, buddy. I don't recognize that country. Try '${prefix}countrylist' for some of the major COVID-19 affected countries that I can respond to.`);
        }
    }
    function stateResult(result) {
        var cases = [];
        var states = [];
        var deaths = [];
        var casestoday = [];
        var deathstoday = [];

        var entity = "state ";

        var statsindex = 0;
        
        var saidstate = userstate.slice(prefix.length + entity.length);
        saidstate = saidstate[0].toUpperCase() + saidstate.slice(1);

        for (i = 0; i < result.length; i++) {
            cases.push(result[i].cases);
        }
        for (i = 0; i < result.length; i++) {
            deaths.push(result[i].deaths);
        }
        for (i = 0; i < result.length; i++) {
            states.push(result[i].state);
        }
        for (i = 0; i < result.length; i++) {
            casestoday.push(result[i].todayCases);
        }
        for (i = 0; i < result.length; i++) {
            deathstoday.push(result[i].todayDeaths);
        }
        
        if (states.includes(saidstate)) {
            statsindex = states.indexOf(saidstate);
            var statelist = new Discord.MessageEmbed()
                .setTitle(saidstate + " Dashboard")
                .addFields(
                    { name: "Cases", value: cases[statsindex]  + " (+" + Math.round(1000*casestoday[statsindex]/cases[statsindex])/10 + "%)", inline: true },
                    { name: "Deaths", value: deaths[statsindex]  + " (+" + Math.round(1000*deathstoday[statsindex]/deaths[statsindex])/10 + "%)", inline: true }
                )
            message.channel.send(statelist);
        } else {
            message.channel.send(`Whoa there, buddy. I don't recognize that state. As of right now, only US states are supported.`);
        }
    }
    function help() {
        var help = new Discord.MessageEmbed()
            .setTitle("Help")
            .setThumbnail("https://iconsplace.com/wp-content/uploads/_icons/ffa500/256/png/help-icon-11-256.png")
            .setDescription("Hey! I'm your very own COVID-19 Discord bot, ready to give you some easy-to-access information on the current pandemic. Below are the commands you'll need to get started:")
            .addFields(
                { name: "Global Stats", value: "To access the global dashboard, use `covid stats`", inline: false },
                { name: "Country List", value: "To see some of the countries that are supported, use `covid countrylist`", inline: false },
                { name: "Specific Country", value: "To access a specific country's statistics, use `covid country <countryname>`", inline: false },
                { name: "Specifc State", value: "To access a specific US state's statistics, use `covid state <statename>`"},
            )
            .setFooter("Special thanks to Crypthes for giving critical feedback during the development of the bot!")
        message.channel.send(help);
    }
    function idk() {
        var idk = new Discord.MessageEmbed()
            .setTitle("Unrecognized Command")
            .setThumbnail("http://clipart-library.com/data_images/81859.png")
            .setDescription("Eeeh! I don't seem to know what that means. Here are some of the commands that I support:")
            .addFields(
                { name: "Global Stats", value: "To access the global dashboard, use `covid stats`", inline: false },
                { name: "Country List", value: "To see some of the countries that are supported, use `covid countrylist`", inline: false },
                { name: "Specific Country", value: "To access a specific country's statistics, use `covid country <countryname>`", inline: false },
                { name: "Specifc State", value: "To access a specific US state's statistics, use `covid state <statename>`"},
            )
        message.channel.send(idk);
    }
});

client.login(token);