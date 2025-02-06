const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const typeMap = {
  GUILD_TEXT: 0, // Text Channel
  GUILD_VOICE: 2, // Voice Channel
  GUILD_ANNOUNCEMENT: 5, // Announcement Channel
  GUILD_STAGE_VOICE: 13, // Stage Channel
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createchannel')
    .setDescription('Membuat channel baru di server')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Nama channel yang ingin dibuat')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Tipe channel')
        .setRequired(true)
        .addChoices(
          { name: 'Text', value: 'GUILD_TEXT' },
          { name: 'Voice', value: 'GUILD_VOICE' },
          { name: 'Announcement', value: 'GUILD_ANNOUNCEMENT' },
          { name: 'Stage', value: 'GUILD_STAGE_VOICE' }
        )
    )
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Nama kategori tempat channel dibuat (Opsional)')
        .setRequired(false)
    ),
  async execute(interaction) {
    const channelName = interaction.options.getString('name');
    const channelTypeString = interaction.options.getString('type');
    const categoryName = interaction.options.getString('category');

    // Konversi type string menjadi angka
    const channelType = typeMap[channelTypeString];

    if (channelType === undefined) {
      return interaction.reply({ content: '⚠️ Tipe channel tidak valid.', ephemeral: true });
    }

    let parentCategory = null;
    if (categoryName) {
      parentCategory = interaction.guild.channels.cache.find(
        c => c.name === categoryName && c.type === 4
      );
      if (!parentCategory) {
        return interaction.reply({ content: `⚠️ Kategori **${categoryName}** tidak ditemukan.`, ephemeral: true });
      }
    }

    const channelOptions = {
      name: channelName,
      type: channelType,
      parent: parentCategory ? parentCategory.id : null,
    };

    try {
      const newChannel = await interaction.guild.channels.create(channelOptions);

      // Membuat embed untuk menampilkan informasi channel yang baru dibuat
      const embed = new EmbedBuilder()
        .setTitle('✅ Channel Berhasil Dibuat!')
        .addFields(
            { name: 'Nama Channel:', value: newChannel.name, inline: false },
            { name: 'Tipe Channel:', value: channelTypeString, inline: false },
            { name: 'Kategori:', value: parentCategory ? parentCategory.name : 'Tidak ada kategori', inline: false }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('❌ Error saat membuat channel:', error);
      await interaction.reply({ content: '⚠️ Terjadi kesalahan saat membuat channel.', ephemeral: true });
    }
  },
};
