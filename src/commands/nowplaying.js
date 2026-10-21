const { SlashCommandBuilder } = require('discord.js');
const { getSubscription } = require('../music/manager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Tampilkan lagu yang sedang diputar'),
    async execute(interaction) {
        const sub = getSubscription(interaction.guild.id);
        if (!sub || !sub.current) return interaction.reply('Tidak ada lagu yang sedang diputar.');
        const track = sub.current;
        await interaction.reply({
            embeds: [{
                title: '▶️ Sekarang Diputar',
                description: `**${track.title}**\nDiminta oleh: ${track.requestedBy.username}`,
                url: track.url,
                color: 0x00ff00,
            }],
        });
    },
};
