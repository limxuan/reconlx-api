async function chatBot(message, input) {
    if(!message) throw new ReferenceError('reconlx => "message" is not defined')
    if(!input) throw new ReferenceError('reconlx => "input" is not defined')
    const fetch = require('node-fetch')
    fetch(`https://some-random-api.ml/chatbot/?message=${input}`)
        .then(res => res.json())
        .then(async json => {
            return message.reply(json.response)
        })
}
module.exports = chatBot;