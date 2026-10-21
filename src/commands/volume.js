const { SlashCommandBuilder } = require('discord.js');
const { getSubscription } = require('../music/manager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Atur volume (1‑100)')
        .addIntegerOption(opt => opt.setName('level')
            .setDescription('Level volume')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)),
    async execute(interaction) {
        const level = interaction.options.getInteger('level');
        const sub = getSubscription(interaction.guild.id);
        if (!sub) return interaction.reply('Bot tidak terhubung ke voice channel.');
        sub.player.state.resource.volume.setVolumeLogarithmic(level / 100);
        await interaction.reply(`🔊 Volume diatur ke **${level}%**`);
    },
};
