const config = require('config');
const { Client, Events, GatewayIntentBits, REST } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(config.get('discord.token'));

client.login(config.get('discord.token'));

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

module.exports = {
    client,
    rest
}