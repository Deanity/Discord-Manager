const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

// Konstanta yang digunakan
const CATEGORY_ID = '1343504030382428293';
const LOG_CHANNEL_ID = '1335122622643572757'; // Ganti dengan ID channel log-mu
const OWNER_ROLE_ID = '1335315132846440583';
const CO_OWNER_ROLE_ID = '1335315294507372595';
const BOTSERVER_ROLE_ID = '1335315350795059273';

// Counter tiket
let ticketCounter = 1;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Buat tiket baru.'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🎫 Ticket Support')
            .setDescription('Klik tombol di bawah untuk membuat tiket.')
            .setColor(0x00FF00);

        const button = new ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel('🎟 Buat Ticket')
            .setStyle(ButtonStyle.Primary);

        await interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] });
    },

    async handleButton(interaction, client) {
        if (interaction.customId === 'create_ticket') {
            // const channelName = `ticket-${ticketCounter++}`;

            const ticketChannel = await interaction.guild.channels.create({
                name: `ticket-${ticketCounter}`,
                type: 0, // Gunakan 0 untuk Text Channel
                parent: CATEGORY_ID, // Ganti dengan ID kategori yang sesuai
                permissionOverwrites: [
                    {
                        id: interaction.guild.id, // Semua orang
                        deny: ['ViewChannel'], // Tidak bisa melihat channel
                    },
                    {
                        id: interaction.user.id, // User yang membuat tiket
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'], // Bisa melihat, mengirim, dan membaca riwayat pesan
                    },
                    {
                        id: OWNER_ROLE_ID, // Role Owner
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'], // Hak akses penuh
                    },
                    {
                        id: CO_OWNER_ROLE_ID, // Role Co-Owner
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'], // Hak akses penuh
                    },
                    {
                        id: BOTSERVER_ROLE_ID, // Role Co-Owner
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'], // Hak akses penuh
                    },
                ],
            });

            // Kirim pesan mention untuk notifikasi ke Owner dan Co-Owner
            await ticketChannel.send(`🔔 Hai <@&${OWNER_ROLE_ID}> dan <@&${CO_OWNER_ROLE_ID}>, tiket baru telah dibuat oleh <@${interaction.user.id}>!`);

            // Membuat embed untuk detail tiket
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setDescription(`🎟️ **Tiket Dibuat!**  
                Terima kasih telah membuat tiket, <@${interaction.user.id}>! \n Tim kami akan segera membantu Anda.`)
                .setTimestamp()
                .setFooter({ 
                    text: `Dibuat oleh ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                });

            const closeButton = new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('❌ Close Ticket')
                .setStyle(ButtonStyle.Danger);

            await ticketChannel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(closeButton)] });
            await interaction.reply({ content: `✅ Tiket telah dibuat: ${ticketChannel}`, ephemeral: true });
        } else if (interaction.customId === 'close_ticket') {
            const channel = interaction.channel;
            await channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false });
            await channel.setName(`closed-${channel.name.split('-')[1]}`);

            const embed = new EmbedBuilder()
            .setTitle('🔒 Ticket Closed')
            .setDescription(`🛑 **Tiket dari** <@${interaction.user.id}> telah ditutup.\n\n📌 Jika Anda masih membutuhkan bantuan, silakan buat tiket baru.`)
            .setColor(0xFF0000)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({
                text: `Ditutup oleh ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            });        

            const reopenButton = new ButtonBuilder()
                .setCustomId('open_ticket')
                .setLabel('🔓 Open Ticket')
                .setStyle(ButtonStyle.Secondary);

            const deleteButton = new ButtonBuilder()
                .setCustomId('delete_ticket')
                .setLabel('🗑️ Delete Ticket')
                .setStyle(ButtonStyle.Danger);

            await interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(reopenButton, deleteButton)] });

            // Log ke channel log
            try {
                const logChannel = await interaction.guild.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
                if (logChannel) {
                    if (!logChannel.permissionsFor(interaction.client.user).has(['ViewChannel', 'SendMessages', 'EmbedLinks'])) {
                        console.error('Bot tidak memiliki izin untuk mengirim pesan di channel log.');
                        return;
                    }

                    const logEmbed = new EmbedBuilder()
                    .setTitle('📜 Ticket Closed')
                    .addFields(
                        { name: '👤 Ditutup oleh', value: `<@${interaction.user.id}>`, inline: true },
                        { name: '📁 Channel', value: `${channel.name}`, inline: true },
                        { name: '🕒 Waktu', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
                    )
                    .setColor(0xFF0000)
                    .setFooter({ text: 'Sistem Ticket', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();                
                
                await logChannel.send({ embeds: [logEmbed] });
                

                } else {
                    console.error(`Log channel dengan ID ${LOG_CHANNEL_ID} tidak ditemukan.`);
                }
            } catch (error) {
                console.error('Error saat mencoba mengirim log tiket:', error);
            }

        } else if (interaction.customId === 'open_ticket') {
            const channel = interaction.channel;
            await channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true });
            await channel.setName(`ticket-${channel.name.split('-')[1]}`);
            await interaction.reply({ content: '✅ Tiket telah dibuka kembali.' });
        } else if (interaction.customId === 'delete_ticket') {
            const channel = interaction.channel;
            await interaction.reply({ content: '🗑️ Tiket akan dihapus dalam 5 detik...' });
            setTimeout(() => channel.delete(), 5000);
        }
    }
};
