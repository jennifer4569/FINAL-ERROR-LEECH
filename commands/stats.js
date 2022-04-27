module.exports = {
    name: 'stats',
    description: 'Displays your player and world stats',
    async execute(message, args, connection){
        function getLevelAndExp(expToLevel, baseExp, expCostRate)
        {
            var level = 0;
            var remainingExp = 0;
            var nextLevelExpRequiredExp = 0;
            while(true)
            {
                var lvlExpRequired = baseExp * (1 - Math.pow(expCostRate, level)) / (1 - expCostRate);
                if(lvlExpRequired <= expToLevel)
                {
                    remainingExp = expToLevel - lvlExpRequired;
                    ++level;
                }
                else
                {
                    nextLevelExpRequiredExp = lvlExpRequired;
                    break;
                }
            }
            return [level, remainingExp, nextLevelExpRequiredExp];
        }

		connection.query(`SELECT * FROM PLAYERS WHERE DiscordID=\"${message.author.id}\";`, function (err, result, fields) {
			if (err) throw err;

            var playerExp = result[0].PlayerExp;
            var worldExp = result[0].WorldExp;

            const basePlayerExp = 10;
            const playerExpCostRate = 1.5;
            var playerStats = getLevelAndExp(playerExp, basePlayerExp, playerExpCostRate);
            var playerLevel = Math.round(playerStats[0]);
            var playerRemainingExp = Math.round(playerStats[1]);
            var playerNextLevelRequiredExp = Math.round(playerStats[2]);

            const baseWorldExp = 100;
            const worldExpCostRate = 3;
            var worldStats = getLevelAndExp(worldExp, baseWorldExp, worldExpCostRate);
            var worldLevel = Math.round(worldStats[0]);
            var worldRemainingExp = Math.round(worldStats[1]);
            var worldNextLevelRequiredExp = Math.round(worldStats[2]);
            
            message.channel.send(`\`\`\`PLAYER: LVL ${playerLevel} (EXP: ${playerRemainingExp}/${playerNextLevelRequiredExp})\n\`\`\`\`\`\`WORLD: LVL ${worldLevel} (EXP: ${worldRemainingExp}/${worldNextLevelRequiredExp})\`\`\``);
		});
    }
}