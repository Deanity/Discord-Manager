const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const logChannelID = '1335122622643572757'; // Ganti dengan ID channel log

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('Menghapus role dari seorang pengguna')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Pengguna yang akan dihapus rolenya')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role yang akan dihapus')
        .setRequired(true)),
        
  async execute(interaction) {
    try {
      const user = interaction.options.getUser('user');
      const role = interaction.options.getRole('role');
      const member = interaction.guild.members.cache.get(user.id);

      if (!member) {
        const embedError = new EmbedBuilder()
          .setColor(0xFF0000) // Merah untuk error
          .setTitle('❌ Gagal Menghapus Role')
          .setDescription(`Pengguna **${user.tag}** tidak ditemukan di server.`);
        return interaction.reply({ embeds: [embedError], ephemeral: true });
      }

      if (!member.roles.cache.has(role.id)) {
        return interaction.reply({ content: `⚠️ Pengguna **${user.tag}** tidak memiliki role **${role.name}**!`, ephemeral: true });
      }

      await member.roles.remove(role);

      // Kirim notifikasi ke user
      const embedSuccess = new EmbedBuilder()
        .setColor(0xFFA500) // Warna oranye untuk perubahan role
        .setTitle('🗑️ Role Dihapus')
        .setDescription(`Role ${role} telah dihapus dari ${user}.`) // Mention role & user
        .setTimestamp();

      await interaction.reply({ embeds: [embedSuccess] });

      // Kirim log ke channel tertentu
      const logChannel = interaction.guild.channels.cache.get(logChannelID);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor(0xe74c3c) // Warna merah untuk log penghapusan
          .setTitle('📜 Role Dihapus')
          .setDescription(`**Role:** ${role}\n**Dihapus dari:** ${member}\n**Oleh:** ${interaction.user}`)
          .setTimestamp()
          .setFooter({ text: 'Sistem Log Role', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        await logChannel.send({ embeds: [logEmbed] });
      }

    } catch (error) {
      console.error('❌ Terjadi kesalahan saat menjalankan /removerole:', error);
      return interaction.reply({ content: '⚠️ Terjadi kesalahan saat menghapus role!', ephemeral: true });
    }
  },
};
