const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let links = [];
let cooldown = false;

client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (cooldown) {
        await interaction.reply({ content: 'Cooldown active. Please wait.', ephemeral: true });
        return;
    }

    if (links.length === 0) {
        await interaction.reply({ content: 'No links available.', ephemeral: true });
        return;
    }

    cooldown = true;
    setTimeout(() => (cooldown = false), 5000); // 5-second cooldown

    const randomLink = links[Math.floor(Math.random() * links.length)];
    await interaction.reply({ content: `Here's your link: ${randomLink}` });
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!setlinks')) {
        links = message.content.split('\n').slice(1); // Skip the command
        message.reply('Links updated!');
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'dispenser') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('dispense')
                .setLabel('Get Link')
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({ content: 'Click the button to get a link!', components: [row] });
    }
});

client.login(process.env.TOKEN);
