

module.exports.DaysAgo = function (date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
};

module.exports.fetchTranscript = async function(message, numberOfMessages, sendToAuthor = false) {
    if(!message) return message.channel.send(`@reconlx/discord.js err: Please specify a message`)
    if(!numberOfMessages) return message.channel.send(`@reconlx/discord.js err: Please specify a number`)
    if(typeof numberOfMessages !== "number") return console.log(`@reconlx/discord.js err: "Number" parameter must be a number.`)
    if(numberOfMessages >= 100) return console.log('@reconlx/discord.js err: "Number" parameter\'s limit is 99 messages.')
    const jsdom = require('jsdom');
    const fs = require('fs')
    const discord = require('discord.js')
    const { JSDOM } = jsdom;
    const dom = new JSDOM();
    const document = dom.window.document;
    let messageCollection = new discord.Collection();
    let channelMessages = await message.channel.messages.fetch({
        limit: numberOfMessages
    }).catch(err => console.log(err));
    messageCollection = messageCollection.concat(channelMessages);

    while(channelMessages.size === 100) {
        let lastMessageId = channelMessages.lastKey();
        channelMessages = await message.channel.messages.fetch({ limit: numberOfMessages, before: lastMessageId }).catch(err => console.log(err));
        if(channelMessages)
            messageCollection = messageCollection.concat(channelMessages);
    }
    let msgs = messageCollection.array().reverse();
    await fs.readFile(require('path').join(__dirname, 'template.html'), 'utf8', async function(err, data) {
        if(data) {
            await fs.writeFile(require('path').join(__dirname, 'index.html'), data, async function(err) {                if(err) return console.log(err) 
                let info = document.createElement('div')
                info.className =  'info';
                let iconClass = document.createElement('div')
                iconClass.className = 'info__guild-icon-container';
                let guild__icon = document.createElement('img')
                guild__icon.className = 'info__guild-icon'
                guild__icon.setAttribute('src', message.guild.iconURL())
                iconClass.appendChild(guild__icon)
                info.appendChild(iconClass)
                
                let info__metadata = document.createElement('div')
                info__metadata.className = 'info__metadata'

                let guildName = document.createElement('div')
                guildName.className = 'info__guild-name'
                let gName = document.createTextNode(message.guild.name);
                guildName.appendChild(gName)
                info__metadata.appendChild(guildName)

                let channelName = document.createElement('div')
                channelName.className = 'info__channel-name'
                let cName = document.createTextNode(message.channel.name);
                channelName.appendChild(cName)
                info__metadata.appendChild(channelName)

                let messagecount = document.createElement('div')
                messagecount.className = 'info__channel-message-count'
                messagecount.appendChild(document.createTextNode(`Transcripted ${numberOfMessages} amount messages.`))
                info__metadata.appendChild(messagecount)
                info.appendChild(info__metadata)
                await fs.appendFile(require('path').join(__dirname, 'index.html'), info.outerHTML, async function(err) {
                    if(err) return console.log(err)
                    msgs.forEach(async msg => {
                        let parentContainer = document.createElement("div");
                        parentContainer.className = "parent-container";
                        let avatarDiv = document.createElement("div");
                        avatarDiv.className = "avatar-container";
                        let img = document.createElement('img');
                        img.setAttribute('src', msg.author.displayAvatarURL());
                        img.className = "avatar";
                        avatarDiv.appendChild(img);
        
                        parentContainer.appendChild(avatarDiv);
        
                        let messageContainer = document.createElement('div');
                        messageContainer.className = "message-container";
        
                        let nameElement = document.createElement("span");
                        let name = document.createTextNode(msg.author.tag + " " + msg.createdAt.toDateString() + " " + msg.createdAt.toLocaleTimeString() + " EST");
                        nameElement.appendChild(name);
                        messageContainer.append(nameElement);
        
                        if(msg.content.startsWith("```")) {
                            let m = msg.content.replace(/```/g, "");
                            let codeNode = document.createElement("code");
                            let textNode =  document.createTextNode(m);
                            codeNode.appendChild(textNode);
                            messageContainer.appendChild(codeNode);
                        }
                        else {
                            let msgNode = document.createElement('span');
                            let textNode = document.createTextNode(msg.content);
                            msgNode.append(textNode);
                            messageContainer.appendChild(msgNode);
                        }
                        parentContainer.appendChild(messageContainer);
                        await fs.appendFile(require('path').join(__dirname, 'index.html'), parentContainer.outerHTML, function(err) {
                            if(err) return console.log(err)
                        })
                        console.log(msg.content)
                    });
                    if(sendToAuthor === true) return message.author.send(new discord.MessageAttachment(fs.createReadStream(require('path').join(__dirname, 'index.html'))))
                    message.channel.send(new discord.MessageAttachment(fs.createReadStream(require('path').join(__dirname, 'index.html'))))
                    
                })
            })
        }
    })
}

module.exports.timedTranscript = async function(message, time) {
    if(!message) return console.log(`@reconlx/discord.js err: Please specify a message`)
    if(!time) return console.log(`@reconlx/discord.js err: Please specify a time in seconds`)
    const jsdom = require('jsdom');
    const fs = require('fs')
    const discord = require('discord.js')
    const { JSDOM } = jsdom;
    const dom = new JSDOM();
    const document = dom.window.document;
    let msgs = [];
    const filter = (m) => m.author.id === message.author.id && message.channel.id === m.id
    try {
        message.channel.awaitMessages(filter, {time : time * 1000, errors: ['time']})
        .then(collected => {
            console.log(collected.first())
            msgs.push(collected.first())
            console.log(msgs)
        })
        // await fs.readFile(require('path').join(__dirname, 'template.html'), 'utf8', async function(err, data) {
        //     if(data) {
        //         await fs.writeFile(require('path').join(__dirname, 'index.html'), data, async function(err) {                if(err) return console.log(err) 
        //             let info = document.createElement('div')
        //             info.className =  'info';
        //             let iconClass = document.createElement('div')
        //             iconClass.className = 'info__guild-icon-container';
        //             let guild__icon = document.createElement('img')
        //             guild__icon.className = 'info__guild-icon'
        //             guild__icon.setAttribute('src', message.guild.iconURL())
        //             iconClass.appendChild(guild__icon)
        //             info.appendChild(iconClass)
                    
        //             let info__metadata = document.createElement('div')
        //             info__metadata.className = 'info__metadata'
    
        //             let guildName = document.createElement('div')
        //             guildName.className = 'info__guild-name'
        //             let gName = document.createTextNode(message.guild.name);
        //             guildName.appendChild(gName)
        //             info__metadata.appendChild(guildName)
    
        //             let channelName = document.createElement('div')
        //             channelName.className = 'info__channel-name'
        //             let cName = document.createTextNode(message.channel.name);
        //             channelName.appendChild(cName)
        //             info__metadata.appendChild(channelName)
    
        //             let messagecount = document.createElement('div')
        //             messagecount.className = 'info__channel-message-count'
        //             messagecount.appendChild(document.createTextNode(`Transcripted amount messages.`))
        //             info__metadata.appendChild(messagecount)
        //             info.appendChild(info__metadata)
        //             await fs.appendFile(require('path').join(__dirname, 'template.html'), info.outerHTML, async function(err) {
        //                 if(err) return console.log(err)
        //                 msgs.forEach(async msg => {
        //                     let parentContainer = document.createElement("div");
        //                     parentContainer.className = "parent-container";
        //                     let avatarDiv = document.createElement("div");
        //                     avatarDiv.className = "avatar-container";
        //                     let img = document.createElement('img');
        //                     img.setAttribute('src', msg.author.displayAvatarURL());
        //                     img.className = "avatar";
        //                     avatarDiv.appendChild(img);
            
        //                     parentContainer.appendChild(avatarDiv);
            
        //                     let messageContainer = document.createElement('div');
        //                     messageContainer.className = "message-container";
            
        //                     let nameElement = document.createElement("span");
        //                     let name = document.createTextNode(msg.author.tag + " " + msg.createdAt.toDateString() + " " + msg.createdAt.toLocaleTimeString() + " EST");
        //                     nameElement.appendChild(name);
        //                     messageContainer.append(nameElement);
            
        //                     if(msg.content.startsWith("```")) {
        //                         let m = msg.content.replace(/```/g, "");
        //                         let codeNode = document.createElement("code");
        //                         let textNode =  document.createTextNode(m);
        //                         codeNode.appendChild(textNode);
        //                         messageContainer.appendChild(codeNode);
        //                     }
        //                     else {
        //                         let msgNode = document.createElement('span');
        //                         let textNode = document.createTextNode(msg.content);
        //                         msgNode.append(textNode);
        //                         messageContainer.appendChild(msgNode);
        //                     }
        //                     parentContainer.appendChild(messageContainer);
        //                     await fs.appendFile(require('path').join(__dirname, 'template.html'), parentContainer.outerHTML, function(err) {
        //                         if(err) return console.log(err)
        //                     })
        //                 });
        //                 if(sendToAuthor === true) return message.author.send(new discord.MessageAttachment(fs.createReadStream(require('path').join(__dirname, 'index.html'))))
        //                 message.channel.send(new discord.MessageAttachment(fs.createReadStream(require('path').join(__dirname, 'index.html'))))
                        
        //             })
        //         })
        //     }
        // })
    } catch (error) {
        console.log(error)
    }

}

module.exports.EmbedPages = async function(message, pages, emoji = ['⏪', '⏩'], time = 60000){

    if(!message) return console.log(`@reconlx/discord.js err: Please specify a message`)
    if(!pages || typeof pages !== 'object') return console.log(`@reconlx/discord.js err: Invalid form [pages].`)
    if(!emoji || emoji.length !== 2) return console.log(`@reconlx/discord.js err: Invalid form [emoji].`)
    if(!time) return console.log(`@reconlx/discord.js err: Please specify a time (miliseconds).`)
    if(typeof time !== "number") return console.log(`@reconlx/discord.js err: time parameter must be in "Numbers".`)
    if(!message.guild.me.hasPermission('MANAGE_MESSAGES')) return console.log(`@reconlx/discord.js err: Discord Client has to have "MANAGE_MESSAGES" permission.`)
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
}

module.exports.confirmation = async function(message, author, validReactions, time = 60000) {
    if(!message) return console.log(`@reconlx/discord.js err: Please specify a message`)
    if(!validReactions || validReactions.length !== 2) return console.log(`@reconlx/discord.js err: Invalid form [emoji].`)
    if(typeof time !== "number") return console.log(`@reconlx/discord.js err: time parameter must be in "Numbers".`)
    if(!message.guild.me.hasPermission('MANAGE_MESSAGES')) return console.log(`@reconlx/discord.js err: Discord Client has to have "MANAGE_MESSAGES" permission.`)

    for (const reaction of validReactions) await message.react(reaction)

    const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id

    return message
      .awaitReactions(filter, { max: 1, time: time })
      .then((collected) => collected.first() && collected.first().emoji.name);
}