const { SlashCommandBuilder } = require('discord.js');
const { getSubscription } = require('../music/manager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Bot masuk ke voice channel dan jadi penjaga abadi'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('Anda harus berada di voice channel terlebih dulu!');
        // Init / retrieve subscription, will also start Zen mode via idle handling
        const sub = getSubscription(interaction.guild.id, channel);
        // Ensure Zen mode starts if queue empty
        sub.processQueue();
        await interaction.reply(`✅ Bot bergabung di ${channel.name} dan akan menjaga suara dengan Zen Mode.`);
    },
};
