import {
    Client,
    Message,
    PermissionString,
    TextChannel,
    User,
} from "discord.js";
import { Collection } from "mongoose";
/**
 * @description Used to display amount difference of days between two dates
 */
export function DaysAgo(date: number): string;

/**
 * @description Converts discord messages into html readable transcripts
 * @param message Message Class (discord.js)
 * @param numberOfMessages amount of messages to be transcripted maximum 100
 * @param sendToAuthor if value is true the transcript will only be sent to the author
 */
export function fetchTranscript(
    message: Message,
    numberOfMessages: number,
    sendToAuthor: boolean
);

/**
 * @description Interactive Embed Messages made possible with reactions!
 * @param message Message Class (discord.js)
 * @param pages Put embeds or normal messages in an array and use this parameter
 * @param pageTravel Enables pages to be switched by sending page numbers
 * @param emoji Two emojis used for the back and front page switcher
 * @param time Amount of time before the page becomes unresponsive
 */
export function ReactionPages(
    message: Message,
    pages: object,
    pageTravel: boolean,
    emoji?: string[],
    time?: number
);

/**
 * @description Confirmation Message
 * @example Ban Commands, Kick Commands
 * @param message Message Class (discord.js)
 * @param validReactions two emojis in an array must be present in this parameter
 * @param time time before this function becomes unresponsive
 */
export function confirmation(
    message: Message,
    validReactions: object,
    time?: number
);

/**
 * @description Timeout used to delete the bot's own message!
 * @param message Message Class (discord.js)
 * @param msgToDelete tobe-deleted Message Class (discord.js)
 * @param time Choose a time, default `10 seconds`
 */
export function timeout(message: Message, msgToDelete: Message, time?: number);

/**
 * @description Easy way to make a chatbot
 * @param message Message Class (discord.js)
 * @param input The message you want to send to the chat bot
 * @param uuid A special id, default the author's id
 */
export function chatBot(message: Message, input: string, uuid?: string): JSON;

interface hangmanOptions {
    channelID: string;
    message: Message;
    permission: PermissionString | PermissionString[];
    word: string;
    client: Client;
}
export class hangman {
    /**
     * @name hangman
     * @kind constructor
     * @param  options options
     * @param  options.channelID channel to send to (channel.id)
     * @param  options.message parameter used for message event
     * @param  options.permission required permission to use this command
     * @param options.word word that needed to be guessed
     * @param  options.client client used to defined Discord.Client
     * @description Easy and simple hangman game!
     */
    constructor(options: hangmanOptions);
    start();
}

interface tttOptions {
    message: Message;
    player_two: User;
}
export class tictactoe {
    /**
     * @name tictactoe
     * @kind constructor
     * @param options options
     * @param options.message parameter used for message event
     * @param options.player_two second player in the game.
     * @description Easy and simple tic tac toe game!
     */
    constructor(options: tttOptions);
}

interface giveawayClientOptions {
    mongoURI?: string;
    emoji?: string;
    defaultColor?: string;
}
interface startOptions {
    channel: TextChannel;
    time: number;
    hostedBy: User;
    description: string;
    winners: Number;
    prize: string;
}
export class GiveawayClient {
    constructor(client: Client, options: giveawayClientOptions);
    /**
     * @method
     * @param options options
     * @param options.channel Channel for the giveaway to be in
     * @param options.time Duration of this giveaway
     * @param options.hostedBy Person that hosted the giveaway
     * @param options.description Description of the giveaway
     * @param options.winners Amount of winners for the giveaway
     * @param options.prize Prize for the  giveaway
     */
    start(options: startOptions);

    /**
     * @method
     * @param MessageID Message ID for the giveaway
     * @param getWinner Choose a winner?
     * @description  End a giveaway, choose a winner (optional)
     */
    end(MessageID: string, getWinner: boolean);

    /**
     * @method
     * @param MessageID message id that the giveaway is in
     * @description Change the winners  for the giveaway
     */
    reroll(MessageID: string);

    /**
     * @method
     * @param activatedOnly display activated giveaways only?
     * @param all display giveaways of  all guilds?
     * @param message message if (all = false)
     * @description Get data on current giveaways hosted by the bot
     */
    getCurrentGiveaways(
        activatedOnly?: boolean,
        all?: boolean,
        message?: Message
    );
    /**
     * @method
     * @param all remove data from all the guilds?
     * @param guildID guild id if value of `all` is `false`
     * @description Removes (activated = false) giveaways
     */
    removeCachedGiveaways(all?: boolean, guildID?: string);
}

interface ordOptions {
    uri: string;
}
export class oldReconDB {
    constructor(options: ordOptions);
    /**
     * @method
     * @param key The key, so you can get it with <MongoClient>.get("key")
     * @param value The value which will be saved to the key
     * @example <reconDB>.set("test","js is cool")
     */
    set(key: string, value: any): Promise<void>;

    /**
     * @method
     * @param key The key you wish to get, and returns value
     * @example <reconDB>.get("test") //Will return "js is cool" (if you have set it)
     */
    get(key: string): Promise<any>;

    /**
     * @method
     * @param key The key you wish to check, returns boolean
     * @example <reconDB>.has("test") // will return true if there is a key
     */
    has(key: string): Promise<boolean>;

    /**
     * @method
     * @param key They key you wish to delete
     * @example <reconDB>.delete("test")
     */
    delete(key: string): Promise<void>;
}

export class reconDB {
    /**
     * @name reconDB
     * @kind constructor
     * @param {Client} client DIscord.JS Client
     * @param {Object} options options
     * @param {String} [options.uri] mongodb connection string (required)
     * @description Estabilishing an connection
     */
    constructor(
        client: Client,
        options: {
            uri: string;
        }
    );
    /**
     * @method
     * @param key The key, so you can get it with <MongoClient>.get("key")
     * @param value The value which will be saved to the key
     * @example <reconDB>.set("test","js is cool")
     */
    set(key: string, value: any): Promise<void>;

    /**
     * @method
     * @param key The key you wish to get, and returns value
     * @example <reconDB>.get("test") //Will return "js is cool" (if you have set it)
     */
    get(key: string): Promise<any>;

    /**
     * @method
     * @param key The key you wish to check, returns boolean
     * @example <reconDB>.has("test") // will return true if there is a key
     */
    has(key: string): Promise<boolean>;

    /**
     * @method
     * @param key They key you wish to delete
     * @example <reconDB>.delete("test")
     */
    delete(key: string): Promise<void>;
    /**
     * @method
     * @description Returns the cached collection
     */
    collection(): Promise<Collection>;
}
