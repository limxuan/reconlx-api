import {
    Client,
    MessageReaction,
    Collection,
    Snowflake,
    TextChannel,
    Message,
    MessageEmbed,
    MessageOptions,
} from "discord.js";
import {
    starMessageData,
    StarboardClientOptions,
    StarboardGuild,
} from "./starboard.interfaces";

export class StarboardClient {
    public client: Client;
    public guilds: StarboardGuild[];
    public cache: Collection<Snowflake, starMessageData[]> = new Collection();

    constructor(options: StarboardClientOptions) {
        this.client = options.client;
        this.guilds = options.Guilds || [];
        this.client.on("ready", () => this.cacheData());
    }

    public config = {
        guilds: {
            set: (StarboardGuilds: StarboardGuild[]) => {
                this.guilds = StarboardGuilds;
                this.cacheData();
            },

            add: (StarboardGuild: StarboardGuild) => {
                const filtered = (this.guilds || []).filter(
                    (x) => x.id === StarboardGuild.id
                );

                this.guilds = [...filtered, StarboardGuild];
                this.cacheData();
            },
        },
    };

    private cacheData() {
        this.guilds.forEach(async (guild) => {
            const channel = this.client.channels.cache.get(
                guild.options.starboardChannel
            ) as TextChannel;
            if (!channel) return;

            const messages = await channel.messages.fetch({ limit: 100 });
            if (!messages) return;

            const value = messages.reduce(
                (accumulator: starMessageData[], message) => {
                    if (message.author.id !== this.client.user.id)
                        return accumulator;

                    const starCount =
                        message.content.match(/(?<=\*\*)\d*(?=\*\*)/)?.[0];

                    const origin =
                        message.embeds?.[0]?.footer?.text.match(/\d*/)?.[0];

                    if (!starCount || !origin) return accumulator;

                    const data: starMessageData = {
                        id: message.id,
                        origin,
                    };
                    return [...accumulator, data];
                },
                []
            );
            this.cache.set(guild.id, value);
        });
    }

    private validGuild(guild: Snowflake) {
        return this.guilds.some((x) => x.id === guild);
    }

    private getData(guildId: Snowflake) {
        return this.guilds.find((x) => x.id === guildId);
    }

    private generateEdit(starCount: number, message: Message): MessageOptions {
        return {
            content: `⭐ **${starCount}** ${message.channel}`,
            embeds: [
                new MessageEmbed()
                    .setAuthor(
                        message.author.tag,
                        message.author.displayAvatarURL({ dynamic: true })
                    )
                    .setColor("#fcc444")
                    .setDescription(message.content)
                    .addField("Source", `[Jump!](${message.url})`)
                    .setImage(message.attachments.first()?.url || null)
                    .setFooter(
                        `${
                            message.id
                        } • ${message.createdAt.toLocaleDateString()}`
                    ),
            ],
        };
    }

    public async listener(reaction: MessageReaction) {
        if (!this.validGuild) return;
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        const { guildId, id } = reaction.message;

        if (
            reaction.emoji.name !== "⭐" ||
            reaction.count < this.getData(guildId)?.options.starCount
        )
            return;

        const data = this.cache.get(guildId) || [];
        const starboardChannel = this.client.channels.cache.get(
            this.guilds.find((x) => x.id === guildId)?.options.starboardChannel
        ) as TextChannel;
        const getMessage = data.find((x) => x.origin === id);
        const generateEdit = this.generateEdit(
            reaction.count,
            reaction.message as Message
        );

        const sendMessage = () => {
            starboardChannel?.send(generateEdit).then((m) => {
                this.cache.set(reaction.message.guildId, [
                    ...data,
                    { id: m.id, origin: reaction.message.id },
                ]);
            });
        };
        if (getMessage) {
            starboardChannel.messages
                .fetch(getMessage.id)
                .then((publishedMessage) => {
                    publishedMessage.edit(generateEdit);
                })
                .catch(sendMessage);
        } else sendMessage();
    }
}
