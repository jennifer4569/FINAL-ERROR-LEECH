module.exports = {
    name: 'howtoplay',
    description: 'Tells you how to play the game!',
    async execute(message, args, connection, openWorlds){
        var howToPlay = "```ERROR: L33CH is an idle game where progression is split into two parts: player progression, and world progression. ``````There are two methods of player progression:\n\
1. Opening your world: You can open your world for an hour, and both your player level and your world level will increase over time. Your world will be open to the public (so anyone can join your world), so beware: there may be other players looking to leech off of your progression!\n\
2. Leeching off of another player's world: You can leech off of other players' worlds for thirty minutes. This slows down their progression, but you'll gain bonus exp. However, if the world owner has safeguard turned on, the owner will be leeching off of you instead!``````\n\
Command Usage:\n\
!stats: Displays your player and world level and exp.\n\
!openworld safeguardoff: Opens your world for an hour with safeguard mode off. Beware of leechers!\n\
!openworld safeguardon: Opens your world for an hour with safeguard mode on. This halves your player progression, but allows you to leech off of anyone attempting to leech off of you.\n\
!allopenworlds: Displays all of the worlds that are currently open.\n\
!startleech <worldID>: Starts leeching off of the respective world. The world must be open in order to leech off of them!```";
        message.channel.send(howToPlay);
    }
}