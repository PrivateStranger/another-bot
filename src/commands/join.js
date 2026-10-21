const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { client } = require('../index');
const playce = require('play-dl'); // I will add this dependency

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Bot masuk ke voice channel dan jadi penjaga abadi'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('Lu harus masuk voice channel dulu!');

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        // Zen Mode Logic
        const player = createAudioPlayer();
        
        const playZenMode = async () => {
            try {
                const stream = await playce.stream(process.env.DEFAULT_MUSIC_URL);
                const resource = createAudioResource(stream.stream, { inputType: stream.type });
                player.play(resource);
            } catch (e) {
                console.error('Zen mode error:', e);
            }
        };

        player.on(AudioPlayerStatus.Idle, () => {
            console.log('Music idle, restarting Zen Mode...');
            playZenMode();
        });

        connection.subscribe(player);
        playZenMode();

        await interaction.reply(`✅ Gue udah standby di ${channel.name}. Gue bakal jaga tempat ini sampai kiamat.`);
    },
};
