import {
    ButtonInteraction,
    MessageActionRow,
    MessageButton,
    MessageButtonStyleResolvable,
    MessageComponentType,
    MessageEmbed,
} from "discord.js";
import { ButtonNames, PaginationOptions } from "./pagination.interfaces";

const defaultEmojis = {
    first: "⬅️",
    previous: "◀️",
    next: "▶️",
    last: "➡️",
    number: "#️⃣",
};

const defaultStyles = {
    first: "PRIMARY",
    previous: "PRIMARY",
    next: "PRIMARY",
    last: "PRIMARY",
    number: "SUCCESS",
};

export const pagination = async (options: PaginationOptions) => {
    const {
        author,
        channel,
        embeds,
        button,
        time,
        max,
        customFilter,
        fastSkip,
        pageTravel,
    } = options;
    let currentPage = 1;

    const getButtonData = (name: ButtonNames) => {
        return button?.find((btn) => btn.name === name);
    };

    const generateButtons = (state?: boolean) => {
        const checkState = (name: ButtonNames) => {
            if (
                (["first", "previous"] as ButtonNames[]).includes(name) &&
                currentPage === 1
            )
                return true;

            if (
                (["next", "last"] as ButtonNames[]).includes(name) &&
                currentPage === embeds.length
            )
                return true;

            return false;
        };

        let names: ButtonNames[] = ["previous", "next"];
        if (fastSkip) names = ["first", ...names, "last"];
        if (pageTravel) names.push("number");

        return names.reduce(
            (accumulator: MessageButton[], name: ButtonNames) => {
                accumulator.push(
                    new MessageButton()
                        .setEmoji(
                            getButtonData(name)?.emoji || defaultEmojis[name]
                        )
                        .setCustomId(name)
                        .setDisabled(state || checkState(name))
                        .setStyle(
                            getButtonData(name)?.style ||
                                (defaultStyles[
                                    name
                                ] as MessageButtonStyleResolvable)
                        )
                );
                return accumulator;
            },
            []
        );
    };

    const components = (state?: boolean) => [
        new MessageActionRow().addComponents(generateButtons(state)),
    ];

    const changeFooter = () => {
        const embed = embeds[currentPage - 1];
        const newEmbed = new MessageEmbed(embed);
        if (embed?.footer?.text) {
            return newEmbed.setFooter(
                `${embed.footer.text} - Page ${currentPage} of ${embeds.length}`,
                embed.footer.iconURL
            );
        }
        return newEmbed.setFooter(`Page ${currentPage} of ${embeds.length}`);
    };

    const initialMessage = await channel.send({
        embeds: [changeFooter()],
        components: components(),
    });

    const defaultFilter = (interaction: ButtonInteraction) => {
        if (!interaction.deferred) interaction.deferUpdate();
        return interaction.user.id === author.id;
    };

    const filter = customFilter || defaultFilter;

    const collectorOptions = () => {
        const opt = {
            filter,
            componentType: "BUTTON" as MessageComponentType,
        };

        if (max) opt["max"] = max;
        if (time) opt["time"] = time;

        return opt;
    };

    const collector = channel.createMessageComponentCollector(
        collectorOptions()
    );

    const pageTravelling = new Set();

    const numberTravel = async () => {
        if (pageTravelling.has(author.id))
            return channel.send("Type `end` to stop page travelling!");
        const collector = channel.createMessageCollector({
            filter: (msg) => msg.author.id === author.id,
            time: 30000,
        });
        const numberTravelMessage = await channel.send(
            `${author.tag}, you have 30 seconds, send numbers in chat to change pages! Simply type \`end\` to exit from page travelling.`
        );
        pageTravelling.add(author.id);

        collector.on("collect", (message) => {
            if (message.content.toLowerCase() === "end") {
                message.delete().catch(() => {});
                return collector.stop();
            }
            const int = parseInt(message.content);
            if (isNaN(int) || !(int < embeds.length) || !(int >= 1)) return;
            currentPage = int;
            initialMessage.edit({
                embeds: [changeFooter()],
                components: components(),
            });
            if (message.guild.me.permissions.has("MANAGE_MESSAGES"))
                message.delete();
        });

        collector.on("end", () => {
            if (numberTravelMessage.deletable) numberTravelMessage.delete();
            pageTravelling.delete(author.id);
        });
    };

    collector.on("collect", async (interaction) => {
        const id = interaction.customId as ButtonNames;

        if (id === "first") currentPage = 1;
        if (id === "previous") currentPage--;
        if (id === "next") currentPage++;
        if (id === "last") currentPage = embeds.length;
        if (id === "number") await numberTravel();

        initialMessage.edit({
            embeds: [changeFooter()],
            components: components(),
        });
    });

    collector.on("end", () => {
        initialMessage.edit({
            components: components(true),
        });
    });
};
