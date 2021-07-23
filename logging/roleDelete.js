const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = async (client, role, user) => {
	let guild = role.guild;
	const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'channelSettings';").get();
	client.getScore = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO channelSettings (guildID, logsID, welcomeID, suggestID) VALUES (@guildID, @logsID, @welcomeID, @suggestID);");
    
	let score;
	
	score = client.getScore.get(guild.id);
		  
	if (!score) {
		score = { guildID: guild.id };
	}

	if(score.logsID === 'false') {
		return;
	}
	
	const embed = new MessageEmbed()
		.setAuthor("Role Deleted | "+ role.name)
		.setColor(embedColor)
		.addField('Name', role.name, true)
		.addField('Colour', role.color, true)
		.addField('Hoisted?', role.hoist, true)
		.addField('Mentionable?', role.mentionable, true)
		.addField('Deleted By', "Currently Unavailable", true)
		.setFooter('Role ID '+ role.id)
		.setTimestamp();
	client.channels.cache.get(score.logsID).send(embed);
	return;
}