const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('createcategory')
      .setDescription('Membuat kategori baru di server')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addStringOption(option => 
        option.setName('name')
          .setDescription('Nama kategori yang ingin dibuat')
          .setRequired(true)
      ),
    async execute(interaction) {
      const categoryName = interaction.options.getString('name');
  
      try {
        await interaction.guild.channels.create({
          name: categoryName,
          type: 4, // 4 = CATEGORY
        });
        await interaction.reply(`✅ Kategori **${categoryName}** berhasil dibuat!`);
      } catch (error) {
        console.error('❌ Error saat membuat kategori:', error);
        await interaction.reply({ content: '⚠️ Terjadi kesalahan saat membuat kategori.', ephemeral: true });
      }
    },
  };