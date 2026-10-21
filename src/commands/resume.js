const { SlashCommandBuilder } = require('discord.js');
const { getSubscription } = require('../music/manager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Lanjutkan playback yang dijeda'),
    async execute(interaction) {
        const sub = getSubscription(interaction.guild.id);
        if (!sub) return interaction.reply('Bot tidak terhubung ke voice channel.');
        sub.player.unpause();
        await interaction.reply('▶️ Playback dilanjutkan.');
    },
};
