const client = require('../apps').getClient();
const Discord = require('discord.js');
const config = require('../../config.json');
const moment = require('moment');
const edtUtils = require('./edtUtils');

exports.getInfos = (msg) => {
    let embed = getEmbed(msg);
    embed.addField(`${config.discord.prefix}`, "Affiche la liste des emplois du temps", false);
    embed.addField(`${config.discord.prefix}me`, "Affiche votre emploi du temps favori", false);
    embed.addField(`${config.discord.prefix}url`, "Site de consultation des emplois du temps", false);
    embed.addField(`${config.discord.prefix}<nom>`, "Affiche l'emploi du temps à la date du jour", false);
    embed.addField(`${config.discord.prefix}<nom> <nombre jour>`, "Affiche l'emploi du temps à x jour(s) de différence", false);
    return embed;
};

exports.getListEDT = (msg, res) => {
    let embed = getEmbed(msg);
    res.forEach(univ => {
        embed.addField(`**${univ.nomUniv} :**`, "\u200B", false);

        univ.data.forEach(annee => {
            let str = "";

            annee.data.forEach(edt => {
                str += `\n  • ${edt.edtName}`;
            });

            embed.addField(`${annee.numAnnee}A`, str, true);
        });

        if (res.indexOf(univ) > 0 && res.indexOf(univ) + 1 < res.length)
            embed.addBlankField(false);
    });

    return embed;
}

exports.getEdtNDay = (msg, edtInfos, data, nDay) => {
    let embed = getEmbed(msg);
    embed.setAuthor(embed.author.name + " - " + edtInfos.edtName + " - " + getNDayInfos(nDay), embed.author.icon_url, embed.author.url);
    embed.setTitle("Update le : " + moment(edtInfos.lastUpdate).format("DD/MM/YYYY [à] HH:mm"));
    data.filter(item => edtUtils.isDateValid(moment(item.start), nDay))
        .forEach(item => {
            let location = item.location || "?";
            embed.addField(`${getHour(item.start)} - ${getHour(item.end)} (${location})`, item.title);
        });
    return embed;
}

function getNDayInfos(nDay) {
    if (nDay == -1) return "Hier";
    if (nDay == 0) return "Aujourdhui";
    if (nDay == 1) return "Demain";
    else return "Jour " + (nDay < 0 ? nDay : "+" + nDay);
}

function getHour(date) {
    return moment(date).format("HH[h]mm").replace('h00', 'h');
}

function getEmbed(msg) {
    return new Discord.RichEmbed()
        .setColor('#F44336')
        .setAuthor("EtuEDT", client.user.avatarURL, config.edtURL)
        .setFooter(msg.author.tag, msg.author.avatarURL)
        .setTimestamp();
}