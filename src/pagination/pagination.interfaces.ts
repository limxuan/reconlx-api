import { ButtonInteraction, Message, MessageEmbed } from "discord.js";

export interface PaginationOptions {
    /**
     * discord.js message class
     */
    message: Message;

    /**
     * array of embed messages to paginate
     */
    embeds: MessageEmbed[];

    /**
     * emoji unicode or a custom emoji's id
     */
    button?: Button[];

    /**
     * travel pages by sending page numbers?
     */
    pageTravel?: boolean;

    /**
     * two additional buttons, a button to skip to the end and a button to skip to the first page
     */
    fastSkip?: boolean;

    /**
     * how long before buttons get disabled
     */
    time?: number;

    /**
     * maximum interactions before disabling the pagination
     */
    max?: number;
    /**
     * custom filter for message component collector
     */
    customFilter?(interaction: ButtonInteraction): boolean;
}
export type ButtonNames = "first" | "previous" | "next" | "last" | "number";

export interface Button {
    name: ButtonNames;
    emoji?: string;
    style?: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER";
}
