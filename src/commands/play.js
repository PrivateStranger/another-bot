const { SlashCommandBuilder } = require('discord.js');
const { getSubscription } = require('../music/manager');
const playdl = require('play-dl');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a track from YouTube URL or search query')
        .addStringOption(opt => opt.setName('query')
            .setDescription('YouTube URL or search terms')
            .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('Anda harus berada di voice channel terlebih dulu!');
        const sub = getSubscription(interaction.guild.id, channel);
        const query = interaction.options.getString('query');
        let url = query.trim();
        if (!/^https?:\/\//i.test(url)) {
            // search YouTube via play-dl
            const results = await playdl.search(url, { limit: 1 });
            if (!results || results.length === 0) {
                return interaction.reply('Tidak menemukan hasil pencarian apa pun.');
            }
            url = results[0].url;
        }
        try {
            const track = await sub.enqueue(url, interaction.user);
            await interaction.reply(`✅ **${track.title}** ditambahkan ke antrian.`);
        } catch (e) {
            console.error(e);
            await interaction.reply('❌ Gagal menambahkan lagu ke antrian.');
        }
    },
};
