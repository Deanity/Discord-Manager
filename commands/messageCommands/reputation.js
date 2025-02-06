const fs = require('fs');
const path = require('path');

// Path ke file database
const reputationPath = path.join(__dirname, '../..', 'database', 'reputation.json');

// Fungsi untuk membaca database
function loadReputation() {
    if (!fs.existsSync(reputationPath)) {
        fs.writeFileSync(reputationPath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(reputationPath, 'utf8'));
}

// Fungsi untuk menyimpan database
function saveReputation(data) {
    fs.writeFileSync(reputationPath, JSON.stringify(data, null, 2));
}

module.exports = {
    name: 'messageCreate',
    async execute(message) {        
        // Command +reps
        if (message.content.startsWith('+reps')) {
            const mentionedUser = message.mentions.users.first();
            const giver = message.author;

            if (!mentionedUser) {
                return message.reply('Kamu harus menyebutkan pengguna yang ingin diberikan reputasi! Contoh: `+reps @username`');
            }

            if (mentionedUser.id === giver.id) {
                return message.reply('Kamu tidak bisa memberikan reputasi ke diri sendiri!');
            }

            const reputationData = loadReputation();

            if (!reputationData[mentionedUser.id]) {
                reputationData[mentionedUser.id] = 0;
            }
            reputationData[mentionedUser.id]++;

            saveReputation(reputationData);

            const embed = {
                color: 0x00FF00,
                title: 'Reputasi Ditambahkan! 🎉',
                description: `<@${giver.id}> telah menambahkan reputasi untuk <@${mentionedUser.id}>.`,
                fields: [
                    { name: 'Jumlah Reputasi', value: `${reputationData[mentionedUser.id]}`, inline: true },
                ],
                timestamp: new Date(),
            };

            await message.reply({ embeds: [embed] });
        }

        // Command ?reps untuk menampilkan leaderboard
        if (message.content.startsWith('?reps')) {
            const reputationData = loadReputation();
            const leaderboard = Object.entries(reputationData)
                .sort(([, a], [, b]) => b - a) // Urutkan dari reputasi tertinggi ke terendah
                .slice(0, 10); // Ambil 10 besar

            if (leaderboard.length === 0) {
                return message.reply('Belum ada data reputasi yang tersedia.');
            }

            const leaderboardText = leaderboard.map(([userId, reps], index) => {
                return `**${index + 1}.** <@${userId}> - **${reps}** reps`;
            }).join('\n');

            const embed = {
                color: 0x0099FF,
                title: '🏆 Total Reputasi',
                description: leaderboardText,
                timestamp: new Date(),
            };

            await message.reply({ embeds: [embed] });
        }
    },
};
