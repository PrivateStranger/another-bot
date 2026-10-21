const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const playdl = require('play-dl');

// Global map of guildId -> subscription object
const subscriptions = new Map();

/**
 * Get or create a subscription for a guild.
 * @param {string} guildId
 * @param {VoiceChannel} voiceChannel optional, required first time
 * @returns {object} subscription { connection, player, queue, current, enqueue }
 */
function getSubscription(guildId, voiceChannel) {
    let sub = subscriptions.get(guildId);
    if (sub) return sub;
    if (!voiceChannel) return null; // cannot create without channel
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });
    connection.subscribe(player);
    const queue = [];
    const subObj = {
        connection,
        player,
        queue,
        current: null,
        async enqueue(url, requester) {
            // use play-dl to get stream
            const info = await playdl.video_info(url);
            const stream = await playdl.stream(info.video_details.url);
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type,
                inlineVolume: true,
            });
            const track = {
                title: info.video_details.title,
                url: info.video_details.url,
                requestedBy: requester,
                resource,
            };
            this.queue.push(track);
            this.processQueue();
            return track;
        },
        async processQueue() {
            if (this.player.state.status !== AudioPlayerStatus.Idle) return;
            // If queue empty, fallback to Zen mode (default music)
            if (this.queue.length === 0) {
                const zenUrl = process.env.DEFAULT_MUSIC_URL;
                if (!zenUrl) return;
                const info = await playdl.video_info(zenUrl);
                const stream = await playdl.stream(info.video_details.url);
                const resource = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true });
                resource.volume.setVolumeLogarithmic(0.5);
                this.current = { title: info.video_details.title, url: info.video_details.url, requestedBy: { username: 'Zen Mode' }, resource };
                this.player.play(this.current.resource);
                return;
            }
            const next = this.queue.shift();
            this.current = next;
            this.player.play(next.resource);
        },
    };
    // Auto‑restart Zen mode on idle
    player.on(AudioPlayerStatus.Idle, () => {
        subObj.processQueue();
    });
    // handle errors
    player.on('error', error => console.error('Audio Player Error:', error));
    subscriptions.set(guildId, subObj);
    return subObj;
}

module.exports = { getSubscription };
