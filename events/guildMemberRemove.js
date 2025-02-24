const { EmbedBuilder } = require('discord.js');
const { goodbyeChannelID } = require('../config');

module.exports = (client) => {
    client.on('guildMemberRemove', async (member) => {  
        const channel = member.guild.channels.cache.get(goodbyeChannelID);
        if (!channel) return console.error('❌ Channel tidak ditemukan atau bot tidak memiliki akses.');

        const goodbyeEmbed = new EmbedBuilder()
        .setColor('#FF4500')
        .setDescription(`😢 <@${member.id}> telah meninggalkan **${member.guild.name}**.`)
        .setImage('https://cdn.discordapp.com/attachments/1320314372123529236/1335444273109139456/standard_2.gif');

        await channel.send({ embeds: [goodbyeEmbed] });
    });
};
