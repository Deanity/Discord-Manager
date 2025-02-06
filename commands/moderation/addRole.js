const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const logChannelID = '1335122622643572757'; // Ganti dengan ID channel log

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Menambahkan role ke pengguna tertentu.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Pengguna yang akan diberi role')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role yang akan diberikan')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    try {
      const member = interaction.options.getMember('target');
      const role = interaction.options.getRole('role');

      // Cek izin pengguna
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('🚫 Akses Ditolak')
          .setDescription('Anda tidak memiliki izin untuk menambahkan role!');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // Cek apakah member & role valid
      if (!member || !role) {
        return interaction.reply({ content: '⚠️ Pengguna atau role tidak ditemukan.', ephemeral: true });
      }

      // Cek apakah bot memiliki izin
      if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return interaction.reply({ content: '⚠️ Bot tidak memiliki izin **Manage Roles**!', ephemeral: true });
      }

      // Cek apakah bot dapat memberikan role (harus lebih tinggi)
      if (interaction.guild.members.me.roles.highest.position <= role.position) {
        return interaction.reply({ content: '⚠️ Bot tidak dapat memberikan role ini karena role lebih tinggi!', ephemeral: true });
      }

      // Tambahkan role ke member
      await member.roles.add(role);

      // Kirim notifikasi ke user
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('✅ Role Ditambahkan')
        .setDescription(`Role ${role} telah diberikan ke ${member}.`); // Mention role & user langsung
      await interaction.reply({ embeds: [embed] });

      // Kirim log ke channel tertentu
      const logChannel = interaction.guild.channels.cache.get(logChannelID);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor(0x3498db)
          .setTitle('📜 Role Ditambahkan')
          .setDescription(`**Role:** ${role}\n**Diberikan kepada:** ${member}\n**Oleh:** ${interaction.user}`)
          .setTimestamp()
          .setFooter({ text: 'Sistem Log Role', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        await logChannel.send({ embeds: [logEmbed] });
      }

    } catch (error) {
      console.error('❌ Terjadi kesalahan saat menjalankan /addrole:', error);
      return interaction.reply({ content: '⚠️ Terjadi kesalahan saat menambahkan role!', ephemeral: true });
    }
  },
};
