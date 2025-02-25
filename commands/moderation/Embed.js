const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Membuat embed dengan title dan deskripsi.')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction) {

        if (interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({ content: '❌ Hanya pemilik server yang dapat menggunakan perintah ini.', ephemeral: true });
        }

        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const embed = new EmbedBuilder()
            .setTitle(`<a:raja:1324772667877883977> Price List Jasa Farming CPS <a:raja:1324772667877883977>`)
            .setDescription(`**<a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648> \n <:tangan:1343481170998067272>PTHT UWS ME 40 <:DL:1320541428274696292> \n <:tangan:1343481170998067272>PTHT UWS YOU 30 <:DL:1320541428274696292> \n <a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648> \n <:pukul:1320779662242353195> PNB CONSUME ME 10K/35 <:DL:1320541428274696292> \n <:pukul:1320779662242353195> PNB COMSUME YOU 10K/30 <:DL:1320541428274696292> \n <a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648> \n <:kotaksedot:1343482138917339177> FIND POG SEED 100K/13 <a:bgls:1324767458556514344> \n <:kotaksedot:1343482138917339177> FIND POG BLOCK 100K/240 <:DL:1320541428274696292> \n <a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648><a:rgb:1320721179606253648> \n - MIN ORDER PTHT 250+ UNDER? BEDA HARGA**`)
            .setColor(`#${randomColor}`);

        await interaction.deferReply({ ephemeral: true }); // Menghilangkan tampilan command reply
        await interaction.deleteReply(); // Menghapus tampilan command setelah defer
        await interaction.channel.send({ embeds: [embed] }); // Mengirim embed tanpa mereply
    }
};




