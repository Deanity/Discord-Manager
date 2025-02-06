const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const logChannelID = '1335122622643572757'; // Ganti dengan ID channel log

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Memberikan timeout kepada anggota')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Anggota yang akan di-timeout')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('durasi')
        .setDescription('Durasi timeout dalam menit')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Alasan timeout')
        .setRequired(false)),

  async execute(interaction) {
    try {
      const user = interaction.options.getUser('user');
      const durasi = interaction.options.getInteger('durasi');
      const reason = interaction.options.getString('reason') || 'Tidak ada alasan.';
      const member = interaction.guild.members.cache.get(user.id);

      if (!member) {
        const embedError = new EmbedBuilder()
          .setColor(0xFF0000) // Merah untuk error
          .setTitle('❌ Gagal Memberikan Timeout')
          .setDescription(`Pengguna **${user.tag}** tidak ditemukan di server.`);
        return interaction.reply({ embeds: [embedError], ephemeral: true });
      }

      const timeoutMs = durasi * 60 * 1000;
      const oldNickname = member.nickname || user.username; // Simpan nickname sebelum timeout

      await member.timeout(timeoutMs, reason);

      const embedSuccess = new EmbedBuilder()
        .setColor(0xFFA500) // Warna oranye untuk timeout
        .setTitle('⏳ Timeout Diberikan')
        .setDescription(`${user} telah diberikan timeout.`) // Mention user
        .addFields(
          { name: '⏱️ Durasi', value: `${durasi} menit`, inline: true },
          { name: '📝 Alasan', value: reason, inline: true },
          { name: '🔨 Moderator', value: `${interaction.user}` } // Mention moderator
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embedSuccess] });

      // Kirim log ke channel tertentu
      const logChannel = interaction.guild.channels.cache.get(logChannelID);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor(0xFFA500) // Warna oranye untuk log timeout
          .setTitle('📜 Log Timeout')
          .setDescription(`**User:** ${user}\n**Durasi:** ${durasi} menit\n**Alasan:** ${reason}\n**Moderator:** ${interaction.user}`)
          .setTimestamp()
          .setFooter({ text: 'Sistem Log Timeout', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        await logChannel.send({ embeds: [logEmbed] });
      }

      // Pulihkan nickname setelah timeout selesai
      setTimeout(async () => {
        try {
          const refreshedMember = await interaction.guild.members.fetch(user.id);
          if (refreshedMember && refreshedMember.manageable) {
            await refreshedMember.setNickname(oldNickname).catch(console.error);
          }
        } catch (error) {
          console.error('❌ Gagal mengembalikan nickname setelah timeout:', error);
        }
      }, timeoutMs);

    } catch (error) {
      console.error('❌ Terjadi kesalahan saat menjalankan /timeout:', error);
      return interaction.reply({ content: '⚠️ Terjadi kesalahan saat memberikan timeout!', ephemeral: true });
    }
  },
};
