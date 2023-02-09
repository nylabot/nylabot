const drinkUtils = require('../drinkUtils');
module.exports = {
    data: {
        name: 'show-drink'
    },

    /**
     * @param {import('discord.js').CommandInteraction} interaction 
     */
    async execute(interaction) {
        const [buttonId, drinkId] = interaction.customId.split('#');
        await drinkUtils.sendDrink(interaction, drinkId);
    }
}