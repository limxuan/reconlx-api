async function EmbedPages(message, pages, emoji = ['⏪', '⏩'], time = 60000){

    if(!message) throw new ReferenceError('@reconlx/discord.js => "message" is not defined')
    if(!pages || typeof pages !== 'object') throw new SyntaxError('@reconlx/discord.js => Invalid form body [pages]')
    if(!emoji || emoji.length !== 2) throw new SyntaxError('@reconlx/discord.js => Invalid form body [emoji]')
    if(!time) throw new ReferenceError('@reconlx/discord.js => "time" is not defined')
    if(typeof time !== "number") throw new ReferenceError('@reconlx/discord.js => typeof "time" must be a number')
    if(message.guild.me.hasPermission('MANAGE_MESSAGES')) {
        message.channel.send(pages[0].setFooter(`Page 1 / ${pages.length}`)).then(async msg => {
            await msg.react(emoji[0])
            await msg.react(emoji[1])
    
        const filter = (reaction, user) => (emoji.includes(reaction.emoji.name)) && user.id === message.author.id;
    
        const collector = msg.createReactionCollector(filter, { time: time });
        let i = 0;
        collector.on('collect', (reaction, user) => {
            reaction.users.remove(user)
            switch(reaction.emoji.name) {
                case emoji[0] :
                    if(i === 0) return;
                    i--;
                    break;
                case emoji[1] :
                    if(i === pages.length - 1) return;
                    i++;
                    break;
            }
            msg.edit(pages[i].setFooter(`Page ${i + 1} / ${pages.length}`))
        })
        collector.on('end', () => msg.reactions.removeAll());
        return msg;
        })
    } else {
        message.channel.send(pages[0].setFooter(`Page 1 / ${pages.length}`)).then(async msg => {
            await msg.react(emoji[0])
            await msg.react(emoji[1])
    
        const filter = (reaction, user) => (emoji.includes(reaction.emoji.name)) && user.id === message.author.id;
    
        const collector = msg.createReactionCollector(filter, { time: time });
        let i = 0;
        collector.on('collect', (reaction, user) => {
            switch(reaction.emoji.name) {
                case emoji[0] :
                    if(i === 0) return;
                    i--;
                    break;
                case emoji[1] :
                    if(i === pages.length - 1) return;
                    i++;
                    break;
            }
            msg.edit(pages[i].setFooter(`Page ${i + 1} / ${pages.length}`))
        })
        collector.on('end', () => msg.reactions.removeAll());
        return msg;
        })
    }
}

module.exports = EmbedPages;