const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tambahrole') // Nama command yang baru
        .setDescription('Menambahkan role baru ke server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addStringOption(option =>
            option
                .setName('nama')
                .setDescription('Nama role yang ingin ditambahkan.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('warna')
                .setDescription('Warna role dalam format HEX (contoh: #FF5733).')
                .setRequired(false)
        ),
    async execute(interaction) {
        const roleName = interaction.options.getString('nama'); // Mengambil nama role dari opsi
        const roleColor = interaction.options.getString('warna') || '#FFFFFF'; // Default warna putih

        // Periksa apakah bot memiliki izin untuk mengelola role
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({
                content: '❌ Saya tidak memiliki izin untuk mengelola role di server ini.',
                ephemeral: true,
            });
        }

        try {
            // Buat role baru
            const newRole = await interaction.guild.roles.create({
                name: roleName,
                color: roleColor,
                reason: `Role baru ditambahkan oleh ${interaction.user.tag}`,
            });

            // Beri respons ke pengguna
            await interaction.reply({
                content: `✅ Role **${newRole.name}** berhasil ditambahkan dengan warna **${roleColor}**.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('❌ Gagal membuat role:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat mencoba menambahkan role. Pastikan saya memiliki izin yang cukup.',
                ephemeral: true,
            });
        }
    },
};
