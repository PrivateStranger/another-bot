const { SlashCommandBuilder } = require('discord.js');
const { getSubscription } = require('../music/manager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Jeda playback'),
    async execute(interaction) {
        const sub = getSubscription(interaction.guild.id);
        if (!sub) return interaction.reply('Bot tidak terhubung ke voice channel.');
        sub.player.pause();
        await interaction.reply('⏸️ Playback dijeda.');
    },
};
