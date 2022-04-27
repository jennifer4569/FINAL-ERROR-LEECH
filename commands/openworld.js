module.exports = {
    name: 'openworld',
    description: 'Opens your world',
    async execute(message, args, connection, openWorlds, playingPlayers){
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

        if(openWorlds[message.author.id] && openWorlds[message.author.id].isOpen)
        {
            message.channel.send(`${message.author.toString()} tried to open their world, but it is already opened!`);
        }
        else if(playingPlayers.has(message.author.id))
        { 
            message.channel.send(`${message.author.toString()}, you can't open your world when you're performing another action! Try again later.`);
        }
        else if(args.length == 0 || (args[0] != "safeguardon" && args[0] != "safeguardoff"))
        {
            message.channel.send(`${message.author.toString()}, please specify if you want to use the safeguard option: \`!openworld safeguardon\` or \`!openworld safeguardoff\``);
        }
        else
        {
            var worldStats = { numConnected: 0, isOpen: true };
            worldStats.safeguardOn = args[0] == "safeguardon";
            worldStats.ownerName = message.author.username;
            worldStats.ownerID = message.author.id;
            playingPlayers.add(message.author.id);
            await connection.query(`SELECT * FROM PLAYERS WHERE DiscordID=\"${message.author.id}\";`, function (err, result, fields) {
                if (err) throw err;
                
                worldStats.ownerExp = result[0].PlayerExp;
                var worldExp = result[0].WorldExp;
                worldStats.id = result[0].id;

                const baseWorldExp = 100;
                const worldExpCostRate = 3;
                var worldLevelAndExpStats = getLevelAndExp(worldExp, baseWorldExp, worldExpCostRate);
                worldStats.worldLevel = worldLevelAndExpStats[0];
                worldStats.worldRemainingExp = worldLevelAndExpStats[1];
                worldStats.worldNextLevelRequiredExp = worldLevelAndExpStats[2];
                            
                message.channel.send(`Opened ${message.author.toString()}'s world! It will be up for 1 hour.`);
                var timesRun = 0;
                setInterval(function() {
                    timesRun++;
                    if(worldStats.safeguardOn)
                    {
                        worldStats.ownerExp += worldStats.worldLevel * 10 * Math.pow(1.2, worldStats.worldLevel) / 2; //halves progression
                    }
                    else
                    {
                        worldStats.ownerExp += worldStats.worldLevel * 10 * Math.pow(1.2, worldStats.worldLevel) * Math.pow(0.9, worldStats.numConnected);
                    }
                    worldExp += worldStats.ownerExp;
                    worldStats.worldRemainingExp += worldStats.ownerExp;
                    if(worldStats.worldRemainingExp >= worldStats.worldNextLevelRequiredExp)
                    {
                        worldStats.worldLevel++;
                        worldStats.worldRemainingExp -= worldStats.worldNextLevelRequiredExp;
                        worldStats.worldNextLevelRequiredExp = baseWorldExp * (1 - Math.pow(worldExpCostRate, worldStats.worldLevel)) / (1 - worldExpCostRate);
                    }

                    connection.query(`UPDATE PLAYERS SET PlayerExp=${worldStats.ownerExp}, WorldExp=${worldExp} WHERE DiscordID=\"${message.author.id}\";`);
                    if(timesRun == 3600)
                    {
                        playingPlayers.delete(message.author.id);
                        clearInterval(this);
                        message.channel.send(`Closed ${message.author.toString()}'s world.`);
                        worldStats.isOpen = false;
                    }
                }, 1);
                openWorlds[worldStats.id] = worldStats;
            });
        }
    }
}