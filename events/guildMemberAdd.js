const { EmbedBuilder } = require('discord.js');
const { welcomeChannelID } = require('../config');

module.exports = async (client) => {
    client.on('guildMemberAdd', async (member) => {
        const welcomeEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setDescription(`👋 Hai <@${member.id}>, selamat datang di **${member.guild.name}**!\n
        Jangan lupa baca peraturan dan verify ya! 🎊`)
        .setImage('https://cdn.discordapp.com/attachments/1320314372123529236/1335444274149326848/standard.gif?ex=67a030e6&is=679edf66&hm=68ab4553c432c44e69c850a859496542a7bc9494be672dcafbe89d0ae1212e83&');

        const channel = member.guild.channels.cache.get(welcomeChannelID);
        if (channel) {
            await channel.send(`👋 Hai <@${member.id}>, selamat datang di **${member.guild.name}**! 🎉`);
            await channel.send({ embeds: [welcomeEmbed] });
        }
    });
};
