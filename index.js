const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load token dari .env

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Untuk menerima event dari server
    GatewayIntentBits.GuildMessages, // Untuk membaca pesan di channel
    GatewayIntentBits.GuildMembers, // Untuk melihat anggota server
    GatewayIntentBits.MessageContent, // Untuk membaca isi pesan (perlu diaktifkan di developer portal)
  ],
});

// Inisialisasi command collection
client.commands = new Collection();

// Load semua command dari folder "commands"
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', folder, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    } else {
      console.warn(`⚠️ Command ${file} tidak memiliki "data" atau "execute"!`);
    }
  }
}

// Load semua command berbasis pesan dari folder "messageCommands"
const messageCommandFiles = fs
  .readdirSync(path.join(__dirname, 'commands', 'messageCommands'))
  .filter(file => file.endsWith('.js'));

for (const file of messageCommandFiles) {
  const messageCommand = require(path.join(__dirname, 'commands', 'messageCommands', file));
  if (messageCommand.execute) {
    client.on('messageCreate', messageCommand.execute);
  } else {
    console.warn(`⚠️ Message command ${file} tidak memiliki "execute"!`);
  }
}

// Event: Ready
client.once('ready', () => {
  console.log(`✅ Bot ${client.user.tag} telah online!`);
});

// Event: Interaction Create (Menjalankan Slash Command)
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Terjadi kesalahan pada command /${interaction.commandName}:`, error);
    await interaction.reply({ content: '⚠️ Terjadi kesalahan saat menjalankan perintah!', ephemeral: true });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
      const command = client.commands.get('ticket'); // Pastikan nama command sesuai
      if (command && command.handleButton) {
          try {
              await command.handleButton(interaction, client);
          } catch (error) {
              console.error(error);
              await interaction.reply({
                  content: 'Terjadi kesalahan saat menangani interaksi ini.',
                  ephemeral: true,
              });
          }
      }
  }
});

// Mengimpor event
const welcomeEvent = require('./events/guildMemberAdd');
const goodbyeEvent = require('./events/guildMemberRemove');

// Menjalankan event
welcomeEvent(client);
goodbyeEvent(client);

// Login bot dengan token
client.login(process.env.TOKEN);
