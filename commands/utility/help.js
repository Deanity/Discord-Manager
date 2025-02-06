const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Menampilkan daftar command yang tersedia'),

  async execute(interaction) {
    const member = interaction.member;

    // Ambil 2 role teratas (setelah @everyone)
    const topRoles = member.guild.roles.cache
      .filter(role => role.id !== member.guild.id) // Hindari @everyone
      .sort((a, b) => b.position - a.position)
      .first(2);

    // Cek apakah user memiliki salah satu dari 2 role teratas
    if (!topRoles.some(role => member.roles.cache.has(role.id))) {
      const embedError = new EmbedBuilder()
        .setColor(0xFF0000) // Merah untuk error
        .setTitle('❌ Akses Ditolak')
        .setDescription('Anda tidak memiliki izin untuk menggunakan perintah ini.')
        .addFields({ name: '🔒 Syarat:', value: `Hanya anggota dengan **${topRoles.map(r => r.name).join(' & ')}** yang dapat menggunakan perintah ini.` });

      return interaction.reply({ embeds: [embedError], ephemeral: true });
    }

    // Ambil daftar command yang tersedia
    const commands = interaction.client.commands
      .map(cmd => `🔹 \`/${cmd.data.name}\` → ${cmd.data.description}`)
      .join('\n');

    // Buat embed daftar command
    const embedHelp = new EmbedBuilder()
      .setColor(0x00ADEF) // Biru untuk bantuan
      .setTitle('📜 Daftar Command')
      .setDescription('Berikut adalah daftar command yang tersedia:')
      .addFields({ name: '📌 Command:', value: commands || 'Tidak ada command yang tersedia.' })
      .setFooter({ text: `Diminta oleh ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embedHelp] });
  },
};
