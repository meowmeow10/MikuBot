// Import required modules
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// Initialize bot client
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Register slash commands
const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    new SlashCommandBuilder().setName('hello').setDescription('Greets the user!'),
    new SlashCommandBuilder().setName('server').setDescription('Displays server info'),
    new SlashCommandBuilder().setName('userinfo').setDescription('Displays your user info')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function registerCommands() {
    try {
        console.log('🚀 Registering slash commands...');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('✅ Slash commands registered successfully!');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
}

// Bot ready event
client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    await registerCommands();
});

// Slash command interaction event
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('🏓 Pong!');
    } else if (interaction.commandName === 'hello') {
        await interaction.reply(`👋 Hello, ${interaction.user.username}!`);
    } else if (interaction.commandName === 'server') {
        await interaction.reply(`🌍 Server Name: ${interaction.guild.name}\n👥 Members: ${interaction.guild.memberCount}`);
    } else if (interaction.commandName === 'userinfo') {
        await interaction.reply(`👤 Username: ${interaction.user.tag}\n🆔 User ID: ${interaction.user.id}`);
    }
});

// Log in to Discord using bot token
client.login(TOKEN).catch(err => {
    console.error("❌ Failed to log in:", err);
});
