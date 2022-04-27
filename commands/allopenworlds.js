module.exports = {
    name: 'allopenworlds',
    description: 'Lists all of the open worlds',
    async execute(message, args, connection, openWorlds){
        
        if(Object.entries(openWorlds).length == 0)
        {
            message.channel.send("Sorry, there are no open worlds right now.");
        }
        else
        {
            var stringWorlds = "```ID  | LVL  | OWNER USERNAME\n---------------------------------------------------------------";
            for (const [ID, worldStats] of Object.entries(openWorlds)) {
                if(worldStats.isOpen)
                {
                    var idStr = worldStats.id.toString();
                    stringWorlds += "\n" + idStr;
                    for(var i = 0; i < 4 - idStr.length; ++i)
                    {
                        stringWorlds += " ";
                    }
                    var lvlStr = worldStats.worldLevel.toString();
                    stringWorlds += "| " + lvlStr;
                    for(var i = 0; i < 5 - lvlStr.length; ++i)
                    {
                        stringWorlds += " ";
                    }
                    stringWorlds += "| " + worldStats.ownerName;
                }
            }
            stringWorlds += "```";
            message.channel.send(stringWorlds);
        }
    }
}