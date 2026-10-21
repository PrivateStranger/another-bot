const { SlashCommandBuilder } = require('discord.js');
const { getSubscription } = require('../music/manager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Lewati lagu yang sedang diputar'),
    async execute(interaction) {
        const sub = getSubscription(interaction.guild.id);
        if (!sub) return interaction.reply('Bot tidak terhubung ke voice di server ini.');
        sub.player.stop(); // triggers idle event -> next track
        await interaction.reply('⏭️ Lagu dilewati.');
    },
};
