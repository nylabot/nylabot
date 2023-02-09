const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const surreal = require('../surreal');
const drinkUtils = require('../drinkUtils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('drink')
		.setDescription('drink commands')
		.addSubcommand(subcommand => 
			subcommand
				.setName('search')
				.setDescription('Search for a drink')
				.addStringOption(input => 
					input
						.setName('search')
						.setDescription('Search query')
						.setRequired(true)))
		.addSubcommand(subcommand => 
			subcommand
				.setName('random')
				.setDescription('Show a random drink')),

	/**
	 * @param {import('discord.js').CommandInteraction} interaction 
	 */
	async execute(interaction) {		
		if (interaction.options.getSubcommand() === 'search') {
			return await search(interaction)
		}
		if (interaction.options.getSubcommand() === 'random') {
			return await random(interaction)
		}
	},
};

/**
 * @param {import('discord.js').CommandInteraction} interaction 
 */
async function search(interaction) {
	// Get the string provided by the user.
	const searchString = interaction.options.getString('search')
	
	// Fuzzy match on name.
	const [{result}] = await surreal.query('SELECT * FROM drink WHERE name ~ $searchString', { searchString })

	if (result.length > 0) {
		// Send drink info.
		return await drinkUtils.sendDrinkList(interaction, result)
	} else {
		let content = `I found theese:\n`
	
		await interaction.reply({ content: `I didn't find any drinks `, ephemeral: true });
	}
	
}

/**
 * @param {import('discord.js').CommandInteraction} interaction 
 */
async function random(interaction) {
	// Get all ids.
	const [{result}] = await surreal.query('SELECT id FROM drink')

	// Pick a random drink.
	let drink = result[Math.floor(Math.random()*result.length)];

	if (result.length > 0) {
		// Send drink info.
		return await drinkUtils.sendDrink(interaction, drink.id)
	} else {	
		await interaction.reply({ content: `I didn't find any drinks`, ephemeral: true });
	}
	
}