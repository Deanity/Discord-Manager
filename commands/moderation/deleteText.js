const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deletetext')
    .setDescription('Menghapus sejumlah pesan di channel ini')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
      option.setName('jumlah')
        .setDescription('Jumlah pesan yang ingin dihapus (maksimal 100)')
        .setRequired(true)),
  async execute(interaction) {
    const jumlah = interaction.options.getInteger('jumlah');

    if (jumlah < 1 || jumlah > 100) {
      return interaction.reply({ content: 'Harap pilih jumlah antara 1 dan 100.', ephemeral: true });
    }

    const messages = await interaction.channel.bulkDelete(jumlah, true);
    await interaction.reply({ content: `Berhasil menghapus ${messages.size} pesan.`, ephemeral: true });
  },
};
