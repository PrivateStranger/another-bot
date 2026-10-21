const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`🚀 Ready! Logged in as ${client.user.tag}`);
        
        // Register Slash Commands
        try {
            await client.application.commands.set(client.commands.map(cmd => cmd.data));
            console.log('✅ Slash commands registered globally.');
        } catch (err) {
            console.error('❌ Failed to register commands:', err);
        }
    },
};
