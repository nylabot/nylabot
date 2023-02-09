const { ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, EmbedBuilder, Embed } = require('discord.js')
const surreal = require('./surreal')
/**
 * @param {import('discord.js').CommandInteraction} interaction 
 * @param {Array} drinks 
 */
async function sendDrinkList(interaction, drinks) {
	// Get the top 3 drinks (or less...)
	drinks = drinks.slice(0, 5)

	let content = `I found theese:\n`

	// Buttons!
	const row = new ActionRowBuilder()
		.addComponents(
			...drinks.map(drink => 
				new ButtonBuilder()
					.setCustomId(`show-drink#${drink.id}`)
					.setLabel(drink.name)
					.setStyle(ButtonStyle.Primary)
			)
		);

	let components = [row]

	await interaction.reply({ content, components, ephemeral: true });
}

/**
 * 
 * @param {import('discord.js').CommandInteraction} interaction 
 * @param {Array} drinks 
 */
async function sendDrink(interaction, id) {
	// Get the drink and fetch ingredients and units.
	const [{result: [drink]}] = await surreal.query('select * from $id fetch ingredients.ingredient, ingredients.unit', { id })	

	let ingredients = ''

	for (let ingredient of drink.ingredients) {
		let name = ingredient.ingredient.name
		let amount = ''

		if (ingredient.amount) {
			let unit = ''
			let space = ''

			if (ingredient.unit) {
				unit = ingredient.amount > 0 ? ingredient.unit.name.plural : ingredient.unit.name.single
				space = ingredient.unit.spaced === true ? ' ' : ''
			}

			amount = `(**${ingredient.amount}${space}${unit}**)`
		} else {
			if (ingredient.fill)
				amount = '(**fill glass**)'
		}

		ingredients += `${name} ${amount}\n`
	}

	// Embeds!
	const recipe = new EmbedBuilder()
		.setTitle(drink.name)
		.setImage(drink.image)
		.addFields(
			{ name: 'Ingredients', value: ingredients },
			{ name: 'Instructions', value: drink.instructions}
		)
	
	
	await interaction.reply({ embeds: [recipe] });
}

module.exports = {
	sendDrinkList,
	sendDrink
}