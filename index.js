const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();
var commandsHelp = "";
// only looks for commands/*.js files
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    commandsHelp += config.prefix + "`" + command.name + "`: " + command.description + "\n";
}

// runs once the client is ready
client.once('ready', async ()=>{
    console.log('ERROR L33CH is online!');
});

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: config.mysql.host,
	user: config.mysql.user,
	password: config.mysql.password,
	database: config.mysql.database
});

connection.connect();
var openWorlds = {};
var playingPlayers = new Set();
client.on('message', async message =>{
    // ignores messages without the prefix, and messages by the bot itself
    if(!message.content.startsWith(config.prefix) || message.author.bot) 
        return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/\s+/);//removes all writespace from args
    const command = args.shift();
    if(command === 'help'){ 
        message.channel.send("Available Commands:\n" + commandsHelp);
    }
    else if(client.commands.has(command)){
		//check if this is existing or new player
		connection.query(`SELECT * FROM PLAYERS WHERE DiscordID=\"${message.author.id}\";`, async function (err, result, fields) {
			if (err) throw err;
            
			//add player if they're new
			if (!result || result.length == 0)
			{
				connection.query(`INSERT INTO PLAYERS (DiscordID, PlayerExp, WorldExp) VALUES (\"${message.author.id}\", 0, 0);`)
			}
			
			client.commands.get(command).execute(message, args, connection, openWorlds, playingPlayers);
		});
    }
    else{
        message.channel.send("Sorry, I did not understand that command. Available Commands:\n" + commandsHelp);
    }
});

client.login(config.token);