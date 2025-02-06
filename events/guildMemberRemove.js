const { EmbedBuilder } = require('discord.js');
const { goodbyeChannelID } = require('../config'); // Pastikan path benar

module.exports = (client) => {
    client.on('guildMemberRemove', async (member) => {  
        const channel = member.guild.channels.cache.get(goodbyeChannelID);
        
        if (!channel) {
            console.error('❌ Channel tidak ditemukan atau bot tidak memiliki akses.');
            return;
        }

        const goodbyeEmbed = new EmbedBuilder()
        .setColor('#FF4500') // Warna lebih lembut (Oranye kemerahan)
        .setTitle('😢 Sampai Jumpa Lagi!')
        .setDescription(`Sayang sekali <@${member.id}> telah meninggalkan **${member.guild.name}**.`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setImage('https://cdn.discordapp.com/attachments/1320314372123529236/1335444273109139456/standard_2.gif')
        .addFields(
            { name: '👥 Total Member Sekarang', value: `**${member.guild.memberCount}**`, inline: true },
            { name: '📅 Bergabung Sejak', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Good Bye', iconURL: member.user.displayAvatarURL({ dynamic: true }) });
        
        await channel.send({ embeds: [goodbyeEmbed] });
        });
};
