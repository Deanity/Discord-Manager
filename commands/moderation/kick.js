const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const logChannelID = '1344154124777947166'; // Ganti dengan ID channel log

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Keluarkan anggota dari server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => 
      option.setName('target')
        .setDescription('Anggota yang akan dikeluarkan')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Alasan kick')
        .setRequired(false)),

  async execute(interaction) {
    try {
      const target = interaction.options.getUser('target');
      const reason = interaction.options.getString('reason') || 'Tidak ada alasan.';
      const member = interaction.guild.members.cache.get(target.id);

      if (!member) {
        const embedError = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('❌ Gagal Menemukan Anggota')
          .setDescription(`Anggota **${target.tag}** tidak ditemukan di server.`);
        return interaction.reply({ embeds: [embedError], ephemeral: true });
      }

      await member.kick(reason);

      // Kirim notifikasi ke user
      const embedSuccess = new EmbedBuilder()
        .setColor(0xFFA500) // Warna oranye untuk kick
        .setTitle('👢 Anggota Dikeluarkan')
        .setDescription(`**${target}** telah dikeluarkan dari server.`) // Mention user
        .addFields(
          { name: '📝 Alasan', value: reason },
          { name: '🔨 Moderator', value: `${interaction.user}` } // Mention moderator
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embedSuccess] });

      // Kirim log ke channel tertentu
      const logChannel = interaction.guild.channels.cache.get(logChannelID);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor(0xFFA500) // Warna oranye untuk log kick
          .setTitle('📜 Kick User')
          .setDescription(`**User:** ${target}\n**Alasan:** ${reason}\n**Moderator:** ${interaction.user}`)
          .setTimestamp()
          .setFooter({ text: 'Sistem Log Kick', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        await logChannel.send({ embeds: [logEmbed] });
      }

    } catch (error) {
      console.error('❌ Terjadi kesalahan saat menjalankan /kick:', error);
      return interaction.reply({ content: '⚠️ Terjadi kesalahan saat mengeluarkan anggota!', ephemeral: true });
    }
  },
};
