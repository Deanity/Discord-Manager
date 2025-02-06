const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Cek latensi bot'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Menghitung ping...', fetchReply: true });
    
    const latency = sent.createdTimestamp - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setColor(0x3498db) // Warna biru
      .setTitle('🏓 Pong!')
      .setDescription(`**Latensi:** \`${latency}ms\``)
      .setFooter({ text: 'Cek latensi bot' })
      .setTimestamp();

    await interaction.editReply({ content: null, embeds: [embed] });
  },
};
