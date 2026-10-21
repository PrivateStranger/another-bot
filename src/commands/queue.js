const { SlashCommandBuilder } = require('discord.js');
const { getSubscription } = require('../music/manager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Lihat antrian lagu yang tertunda'),
    async execute(interaction) {
        const sub = getSubscription(interaction.guild.id);
        if (!sub) return interaction.reply('Bot tidak terhubung ke voice channel.');
        const queue = sub.queue.map((t, i) => `${i + 1}. **${t.title}** – ${t.requestedBy.username}`);
        if (queue.length === 0) return interaction.reply('✅ Antrian kosong.');
        await interaction.reply({
            content: '**🔊 Antrian Lagu:**\n' + queue.join('\n'),
            ephemeral: true,
        });
    },
};
