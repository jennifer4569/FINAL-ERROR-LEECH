module.exports = {
    name: 'startleech',
    description: 'Starts leeching off of the target world',
    async execute(message, args, connection, openWorlds, playingPlayers){
        if(playingPlayers.has(message.author.id))
        {
            message.channel.send(`${message.author.toString()}, you can't leech when you're performing another action! Try again later.`);
        }
        else if(args.length == 0)
        {
            message.channel.send(`${message.author.toString()}, please specify the ID of the world you want to leech from. Use \`!allopenworlds\` to see a list of all the open worlds.`);
        }
        else if(!openWorlds[args[0]] || !openWorlds[args[0]].isOpen)
        {
            message.channel.send(`${message.author.toString()}, we did not find the specified world ID. Maybe the world is closed? Use \`!allopenworlds\` to see a list of all the open worlds.`);
        }
        else if(openWorlds[args[0]].ownerID == message.author.id)
        {
            message.channel.send(`${message.author.toString()}, you can't leech off of your own world! Use \`!allopenworlds\` to see a list of all the open worlds.`);
        }
        else
        {
            var worldStats = openWorlds[args[0]];
            worldStats.numConnected++;

            connection.query(`SELECT * FROM PLAYERS WHERE DiscordID=\"${message.author.id}\";`, function (err, result, fields) {
                if (err) throw err;
                
                var playerExp = result[0].PlayerExp;
                if(worldStats.safeguardOn)
                {
                    message.channel.send(`${message.author.toString()} tried to start leeching ${worldStats.ownerName}'s world, but it was safeguarded! They will be leeched off of for half an hour.`);
                }
                else
                {
                    message.channel.send(`${message.author.toString()} has started leeching ${worldStats.ownerName}'s world! They will be leeching for half an hour.`);
                }

                var timesRun = 0;
                setInterval(function() {
                    timesRun++;
                    if(worldStats.safeguardOn)
                    {
                        playerExp -= worldStats.worldLevel * 10 * Math.pow(0.1, worldStats.worldLevel);
                        worldStats.ownerExp += worldStats.worldLevel * 10 * Math.pow(0.1, worldStats.worldLevel);
                    }
                    else
                    {
                        playerExp += worldStats.worldLevel * 10 * Math.pow(1.2, worldStats.worldLevel) * Math.pow(1.1, worldStats.numConnected);
                    }

                    connection.query(`UPDATE PLAYERS SET PlayerExp=${playerExp} WHERE DiscordID=\"${message.author.id}\";`);
                    if(timesRun == 1800)
                    {
                        playingPlayers.remove(message.author.id);
                        clearInterval(this);
                        message.channel.send(`${message.author.toString()} has stopped leeching ${world.ownerName}'s world.`);
                        worldStats.isFinished = true;
                    }
                }, 1000);
            });
        }
    }
}