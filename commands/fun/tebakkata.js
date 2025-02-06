const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../database/TebakKata.json');

// Pastikan file database ada
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tebakkata')
    .setDescription('Mainkan permainan tebak kata!'),
  async execute(interaction) {
    const kata = ['apel', 'pisang', 'anggur', 'mangga'];
    const kataAcak = kata[Math.floor(Math.random() * kata.length)];

    const embed = new EmbedBuilder()
      .setColor(0x3498db) // Ganti "BLUE" dengan kode warna hex
      .setTitle('🧩 Tebak Kata!')
      .setDescription(
        `Susun kembali huruf berikut untuk menemukan kata yang benar:\n\n**${kataAcak
          .split('')
          .sort(() => Math.random() - 0.5)
          .join('')}**\n\nKetik jawabanmu di chat!\nKamu punya **30 detik** untuk menebak!`
      );

    await interaction.reply({ embeds: [embed] });

    const filter = (msg) => msg.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 30000,
    });

    let answered = false;

    collector.on('collect', (msg) => {
      if (msg.content.toLowerCase() === kataAcak) {
        answered = true;

        // Update database poin
        if (!database[msg.author.id]) {
          database[msg.author.id] = { points: 0 };
        }
        database[msg.author.id].points += 1;
        fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));

        const successEmbed = new EmbedBuilder()
          .setColor(0x2ecc71) // Ganti "GREEN" dengan kode warna hex
          .setTitle('✅ Jawaban Benar!')
          .setDescription(
            `🎉 ${msg.author} berhasil menebak kata dengan benar! 🎉\n\n**Kata yang benar:** ${kataAcak}\n\n🏆 **Total Poin:** ${database[msg.author.id].points}`
          );

        interaction.channel.send({ embeds: [successEmbed] });
        collector.stop();
      }
    });

    collector.on('end', (_, reason) => {
      if (!answered && reason !== 'user') {
        const failEmbed = new EmbedBuilder()
          .setColor(0xe74c3c) // Ganti "RED" dengan kode warna hex
          .setTitle('⏰ Waktu Habis!')
          .setDescription(
            `❌ Tidak ada yang berhasil menebak kata!\n\n**Jawaban yang benar:** ${kataAcak}`
          );

        interaction.channel.send({ embeds: [failEmbed] });
      }
    });
  },
};
