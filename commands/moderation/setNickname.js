const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const logChannelID = '1344154124777947166'; // Ganti dengan ID channel log

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setnickname')
    .setDescription('Mengubah nickname pengguna')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Pengguna yang ingin diubah nicknamenya')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('nickname')
        .setDescription('Nickname baru')
        .setRequired(true)),

  async execute(interaction) {
    try {
      const user = interaction.options.getUser('user');
      const nickname = interaction.options.getString('nickname');
      const member = interaction.guild.members.cache.get(user.id);

      if (!member) {
        const embedError = new EmbedBuilder()
          .setColor(0xFF0000) // Merah untuk error
          .setTitle('❌ Gagal Mengubah Nickname')
          .setDescription(`Pengguna **${user.tag}** tidak ditemukan di server.`);
        return interaction.reply({ embeds: [embedError], ephemeral: true });
      }

      const oldNickname = member.nickname || user.username; // Jika tidak ada nickname, pakai username asli
      await member.setNickname(nickname);

      const embedSuccess = new EmbedBuilder()
        .setColor(0x1E90FF) // Biru untuk perubahan nickname
        .setTitle('✏️ Nickname Diubah')
        .setDescription(`${user} telah mengubah nickname-nya.`) // Mention user
        .addFields(
          { name: 'Sebelumnya', value: `\`${oldNickname}\``, inline: true },
          { name: 'Sekarang', value: `\`${nickname}\``, inline: true },
          { name: '🔨 Moderator', value: `${interaction.user}` } // Mention moderator
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embedSuccess] });

      // Kirim log ke channel tertentu
      const logChannel = interaction.guild.channels.cache.get(logChannelID);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor(0x1E90FF) // Warna biru untuk log perubahan nickname
          .setTitle('📜 Log Perubahan Nickname')
          .setDescription(`**User:** ${user}\n**Sebelumnya:** \`${oldNickname}\`\n**Sekarang:** \`${nickname}\`\n**Moderator:** ${interaction.user}`)
          .setTimestamp()
          .setFooter({ text: 'Sistem Log Nickname', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        await logChannel.send({ embeds: [logEmbed] });
      }

    } catch (error) {
      console.error('❌ Terjadi kesalahan saat menjalankan /setnickname:', error);
      return interaction.reply({ content: '⚠️ Terjadi kesalahan saat mengubah nickname!', ephemeral: true });
    }
  },
};
