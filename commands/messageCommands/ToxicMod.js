const fs = require('fs');
const { EmbedBuilder } = require('discord.js');

// Daftar kata-kata toxic
const toxicWords = ['kontol', 'anjeng', 'anj', 'kntl', 'pepek', 'ppk', 'asu', 'KONTOL']; // Ganti dengan daftar kata-kata toxic

// ID channel untuk log (ganti dengan ID channel log-toxic di server Anda)
const logChannelId = '1335122622643572757'; // Ganti dengan ID channel log-toxic

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // Abaikan jika pesan berasal dari bot
        if (message.author.bot) return;

        // Deteksi kata-kata toxic
        const lowerCaseMessage = message.content.toLowerCase();
        const detectedToxicWord = toxicWords.find(word => lowerCaseMessage.includes(word));

        if (detectedToxicWord) {
            // Hapus pesan
            await message.delete();

            // Cari channel log berdasarkan ID
            const logChannel = message.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🚨 Log Kata Toxic Terdeteksi')
                .setDescription(`Pesan dari <@${message.author.id}> telah dihapus karena mengandung kata terlarang.`)
                .addFields(
                    { name: '💬 Pesan:', value: `> ${message.content}`, inline: false },
                    { name: '⚠️ Kata Terlarang:', value: `\`${detectedToxicWord}\``, inline: true },
                    { name: '📍 Channel:', value: `<#${message.channel.id}>`, inline: true }
                )
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `ID Pengguna: ${message.author.id}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();
            
                await logChannel.send({ embeds: [embed] });
            }

            // Kirim pesan singkat ke pengguna
            message.author.send('Jangan Toxic Bodo ku ban kau Nanti');
        }
    },
};
