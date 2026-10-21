const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadEvents } = require('./handlers/eventHandler');
const { loadCommands } = require('./handlers/commandHandler');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

async function bootstrap() {
    try {
        await loadEvents(client);
        await loadCommands(client);
        
        console.log('✅ Bot structures loaded.');
        client.login(process.env.TOKEN);
    } catch (err) {
        console.error('❌ Critical error during bootstrap:', err);
        process.exit(1);
    }
}

bootstrap();

module.exports = { client };
