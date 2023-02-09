const config = require('config');
const { Client, Collection, Events, GatewayIntentBits, Routes } = require('discord.js');
const { client, rest } = require('./discord');
const path = require('node:path');
const fs = require('node:fs');

const commands = new Collection();
const buttons = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
const buttonFiles = fs.readdirSync(path.join(__dirname, 'buttons')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(path.join(__dirname, 'commands', file));

    if ('data' in command && 'execute' in command) {
		commands.set(command.data.name, command);
	} else {
		return console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

for (const file of buttonFiles) {
	const button = require(path.join(__dirname, 'buttons', file));

    if ('data' in button && 'execute' in button) {
		buttons.set(button.data.name, button);
	} else {
		return console.log(`[WARNING] The button at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(config.get('discord.clientId'), config.get('discord.guildId')),
			{ body: [...commands.values()].map(c => c.data) },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

client.on(Events.InteractionCreate, async interaction => {  
	if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
    
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
    
        try {
            return await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }

    if (interaction.isButton()) {
        const [buttonId] = interaction.customId.split('#');
        const button = buttons.get(buttonId);

        if (!button) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            return await button.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
        }

    }

});