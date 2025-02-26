const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const logChannelID = '1344154124777947166'; // Ganti dengan ID channel log

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban seorang anggota dari server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Anggota yang akan di-ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Alasan ban')
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

      await member.ban({ reason });

      // Kirim notifikasi ke user
      const embedSuccess = new EmbedBuilder()
        .setColor(0xFF0000) // Warna merah untuk ban
        .setTitle('🔨 Ban User')
        .setDescription(`**${target}** telah di-ban.`) // Mention user
        .addFields(
          { name: '📝 Alasan', value: reason },
          { name: '🔨 Moderator', value: `${interaction.user}` } // Mention yang ban
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embedSuccess] });

      // Kirim log ke channel tertentu
      const logChannel = interaction.guild.channels.cache.get(logChannelID);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor(0xFF0000) // Warna merah untuk ban
          .setTitle('📜 Log Ban User')
          .setDescription(`**User:** ${target}\n**Alasan:** ${reason}\n**Moderator:** ${interaction.user}`)
          .setTimestamp()
          .setFooter({ text: 'Sistem Log Ban', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        await logChannel.send({ embeds: [logEmbed] });
      }

    } catch (error) {
      console.error('❌ Terjadi kesalahan saat menjalankan /ban:', error);
      return interaction.reply({ content: '⚠️ Terjadi kesalahan saat melakukan ban!', ephemeral: true });
    }
  },
};
