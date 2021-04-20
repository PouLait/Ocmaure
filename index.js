const Discord = require('discord.js');
const bot = new Discord.Client();
const token = require('./token.json');
const fs = require('fs');
const bdd = require('./bdd.json');

///Statue du Bot + Joue à///
bot.on('ready', async () => {
    console.log("Le bot est Allumé");
    bot.user.setStatus("dnd");
    setTimeout(() => {
        bot.user.setActivity("Bonne Journée", {type: "LISTENING"});
    }, 100)
});

///Bienvenue + RôleBass///
bot.on('guildMemberAdd', member => {
    bot.channels.cache.get('793180326398263347').send(`⚔️ Un nouveau pirate en vu, il s'agit de ${member} ⚔️`);
    member.roles.add('793216946043617361')
})

///Clear + Warn///
bot.on('message', message => {
    if(message.content.startsWith("!clear")){
    message.delete();
        if(message.member.hasPermission('MANAGE_MESSAGES')){
            let args = message.content.trim().split(/ +/g);

            if(args[1]){
                if(!isNaN(args[1]) && args[1]>= 1 && args[1] <= 99 ){
                    message.channel.bulkDelete(args[1])
                    message.channel.send(`Et Bim, ${args[1]} de message(s) en moins !`)
                }
                else{
                    message.channel.send(`Tu peux mettre que des valeurs entre 1 & 99.`)
                }
            }
            else{
                message.channel.send(`Tu peux mettre que des valeurs entre 1 & 99.`)
            }    
        }
        else{
            message.channel.send(`Tu n'as pas les permissions pour !clear.`)
        }
    }

    if(message.content.startsWith("!warn")){
        if(message.member.hasPermission('BAN_MEMBERS')){

            if(!message.mentions.users.first()) return;
            utilisateur = message.mentions.users.first().id

            if(bdd["warn"][utilisateur] == 4){

                delete bdd["warn"][utilisateur]
                message.guild.members.ban(utilisateur)
            }
            else{
                if(!bdd["warn"][utilisateur]){
                    bdd["warn"][utilisateur] = 1
                    Savebdd();
                    message.channel.send("Tu as " + bdd["warn"][utilisateur] + "avertissements.")
                   
                }
                else{
                    bdd["warn"][utilisateur]++
                    Savebdd();
                    message.channel.send("Tu as " + bdd["warn"][utilisateur] + " avertissements");
                }
            }

        }
    }

    if(message.content.startsWith('!stats')){
        let onlines = message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size;
        let totalmembers = message.guild.members.cache.size;
        let totalservers = bot.guild.cahce.size;
        let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;
        

    }
   

function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    })
}


})
bot.login(token.token)