import {
    ChatInputApplicationCommandData,
    Client,
    CommandInteraction,
    GuildMember,
    PermissionResolvable
} from "discord.js";

export interface RunOptions {
    client: Client;
    interaction: CommandInteraction & { member: GuildMember };
    args: Array<string>;
}

export type RunFunction = (options: RunOptions) => any;

export type CommandOptions = {
    userPermissions?: PermissionResolvable[];
    run: RunFunction;
} & ChatInputApplicationCommandData;

export class Command {
    constructor(commandOptions: CommandOptions) {
        Object.assign(this, commandOptions);
    }
}
