import { version as v } from "../package.json";
export const version = v;

// reconDB
export { reconDB, reconDBSchema } from "./database/reconDB";

// giveaways
export {
    GiveawayClientOptions,
    GiveawayClientSchema,
    StartOptions,
    GiveawayClient,
} from "./giveaways";

// transcript
export { generateTranscript, TranscriptOptions, Message } from "./transcripts";

// pagination
export {
    Button,
    ButtonNames,
    PaginationOptions,
    pagination,
} from "./pagination";

// modmail
export {
    CloseMailSessionOptions,
    ModMailClient,
    ModMailModelOptions,
    ModMailOptions,
} from "./modmail";

// starboard
export {
    StarboardClient,
    StarboardClientOptions,
    StarboardGuild,
    StarboardGuildOptions,
    starMessageData,
} from "./starboard";

// functions
export { chatBot, ChatBotOptions } from "./functions/chatBot";
