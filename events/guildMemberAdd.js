const { EmbedBuilder } = require('discord.js');
const { welcomeChannelID } = require('../config');

module.exports = async (client) => {
    client.on('guildMemberAdd', async (member) => {
        const welcomeEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🎉 Selamat Datang di Server! 🎉')
        .setDescription(`Halo <@${member.id}>, selamat datang di **${member.guild.name}**! 🎊\n
        Kami senang kamu bergabung! Jangan lupa untuk membaca peraturan server dan verify dirimu. 😊`)
        .addFields(
            { name: '👥 Total Member Sekarang', value: `**${member.guild.memberCount}**`, inline: true }
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true })) // Menampilkan avatar pengguna
        .setImage('https://cdn.discordapp.com/attachments/1320314372123529236/1335444274149326848/standard.gif?ex=67a030e6&is=679edf66&hm=68ab4553c432c44e69c850a859496542a7bc9494be672dcafbe89d0ae1212e83&')
        .setTimestamp()
        .setFooter({ text: 'Welcome', iconURL: member.user.displayAvatarURL({ dynamic: true }) });
    
        const channel = member.guild.channels.cache.get(welcomeChannelID);
        if (channel) {
            // Kirim pesan mention + teks biasa
            await channel.send(`👋 Hai <@${member.id}>, selamat datang di **${member.guild.name}**! 🎉`);
        
            // Kirim embed welcome
            await channel.send({ embeds: [welcomeEmbed] });
        }
    
    });
};
