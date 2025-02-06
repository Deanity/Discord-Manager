const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', folder, file));
    if (command.data) commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`🚀 Deploying ${commands.length} commands...`);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('✅ Slash commands berhasil di-deploy!');
  } catch (error) {
    console.error('❌ Gagal deploy slash commands:', error);
  }
})();
