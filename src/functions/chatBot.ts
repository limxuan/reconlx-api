import { Message } from "discord.js";
import axios from "axios";

export interface ChatBotOptions {
    /**
     * discord.js message class
     */
    message: Message;

    /**
     * input for the chatBot
     */
    input: string;

    /**
     * defaults to author's id
     */
    uuid: string;
}

/**
 * @method
 * @description An easy chatbot without api key
 */
export const chatBot = (options: ChatBotOptions): Promise<string> => {
    const { message, input, uuid } = options;
    const baseUrl = `https://yourmommmaosamaobama.hisroyal123.repl.co`;
    /*
    add more options using this repl API
    it has way more options, to check all options, would recommend seeing this readme -
    https://npmjs.com/package/clever-chat
    */

    return new Promise(async (ful, rej) => {
        try {
            const res = await axios.get(
                `${baseUrl}?msg=${encodeURIComponent(input)}&uid=${
                    uuid || message.author.id
                }`
            );

            if (!res.data) rej("an error occured!");

            ful(res.data);
        } catch (err) {
            rej(err);
        }
    });
};
