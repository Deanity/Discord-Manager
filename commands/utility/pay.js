const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Menampilkan format pembayaran dengan QRIS atau informasi harga')
    .addStringOption(option =>
      option.setName('tipe')
        .setDescription('Pilih tipe pembayaran atau informasi')
        .setRequired(true)
        .addChoices(
          { name: 'QRIS', value: 'qris' },
          { name: 'Informasi Harga', value: 'harga' }
        )
    )
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel tujuan untuk mengirim informasi (opsional)')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),
  async execute(interaction) {
    const tipe = interaction.options.getString('tipe');
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    if (tipe === 'qris') {
      // Format pembayaran QRIS
      const qrisImageUrl = 'https://cdn.discordapp.com/attachments/1231383789725421668/1238798416528801812/QRISs.png?ex=679e9eae&is=679d4d2e&hm=7ba172ea9315d3a8f1e4de7053343c1250b95f76851edaa6ce8306497d8a02c6&'; // Ganti dengan URL QRIS Anda
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('📌 Format Pembayaran QRIS')
        .setDescription(
          '1. Scan QR Code berikut \n untuk melakukan pembayaran.\n' +
          '2. Jika sudah melakukan pembayaran,\n kirimkan bukti transfer ke admin.'
        )
        .setImage(qrisImageUrl)
        .setTimestamp();

      await channel.send({ embeds: [embed] });
      if (channel.id !== interaction.channel.id) {
        await interaction.reply({ content: `✅ Format pembayaran QRIS telah dikirim ke **${channel.name}**.`, ephemeral: true });
      } else {
        await interaction.reply({ content: '✅ Format pembayaran QRIS berhasil ditampilkan.', ephemeral: true });
      }
    }

    if (tipe === 'harga') {
      // Informasi harga
      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('📌 Informasi Harga')
        .setDescription(
          '**💲 Daftar Harga Produk**\n' +
          '🛍 **Produk A**: Rp 10.000\n' +
          '🛍 **Produk B**: Rp 25.000\n' +
          '🛍 **Produk C**: Rp 50.000\n\n' +
          'Untuk detail lebih lanjut, hubungi admin!'
        )
        .setFooter({ text: 'Harga dapat berubah sewaktu-waktu. Pastikan konfirmasi dengan admin.' })
        .setTimestamp();

      await channel.send({ embeds: [embed] });
      if (channel.id !== interaction.channel.id) {
        await interaction.reply({ content: `✅ Informasi harga telah dikirim ke **${channel.name}**.`, ephemeral: true });
      } else {
        await interaction.reply({ content: '✅ Informasi harga berhasil ditampilkan.', ephemeral: true });
      }
    }
  },
};
