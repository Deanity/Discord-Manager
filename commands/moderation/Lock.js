const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Mengunci channel agar hanya role tertentu yang bisa mengakses')
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('Role yang bisa mengakses channel')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const channel = interaction.channel;

        try {
            await channel.permissionOverwrites.set([
                {
                    id: interaction.guild.roles.everyone,
                    deny: ['ViewChannel', 'SendMessages']
                },
                {
                    id: role.id,
                    allow: ['ViewChannel', 'SendMessages']
                }
            ]);

            await interaction.reply({ content: `🔒 Channel ini telah dikunci! Hanya ${role} yang bisa mengakses.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Terjadi kesalahan saat mengunci channel.', ephemeral: true });
        }
    }
};
