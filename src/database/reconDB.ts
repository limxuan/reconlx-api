import mongoose, { Schema } from "mongoose";
import { Client, Collection, VoiceBasedChannelTypes } from "discord.js";

export class reconDB {
    public schema = mongoose.model<reconDBSchema>(
        "recondb-collection",
        new Schema({
            key: String,
            value: mongoose.SchemaTypes.Mixed,
        })
    );
    public dbCollection: Collection<string, any> = new Collection();
    public client: Client;

    /**
     * @name reconDB
     * @kind constructor
     * @param {reconDBOptions} options options to use the database
     */

    constructor(options: reconDBOptions) {
        this.client = options.client;
        if (mongoose.connection.readyState !== 1) {
            if (!options.mongooseConnectionString)
                throw new Error(
                    "There is no established  connection with mongoose and a mongoose connection is required!"
                );

            mongoose.connect(options.mongooseConnectionString, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            });
        }
        this.client.on("ready", () => this.ready());
    }

    private ready(): void {
        this.schema.find().then((data) => {
            data.forEach(({ key, value }) => {
                this.dbCollection.set(key, value);
            });
        });
    }

    /**
     * @method
     * @param key  The key, so you can get it with <MongoClient>.get("key")
     * @param value value The value which will be saved to the key
     * @description saves data to mongodb
     * @example <reconDB>.set("test","js is cool")
     */
    public set(key: string, value: any) {
        if (!key || !value) return;
        this.schema.findOne({ key }, async (err, data) => {
            if (err) throw err;
            if (data) data.value = value;
            else data = new this.schema({ key, value });

            data.save();
            this.dbCollection.set(key, value);
        });
    }

    /**
     * @method
     * @param key They key you wish to delete
     * @description Removes data from mongodb
     * @example <reconDB>.delete("test")
     */
    public delete(key) {
        if (!key) return;
        this.schema.findOne({ key }, async (err, data) => {
            if (err) throw err;
            if (data) await data.delete();
        });
    }

    public collection(): Collection<string, any> {
        return this.dbCollection;
    }
}

export interface reconDBOptions {
    /**
     * discord.js client
     */
    client: Client;

    /**
     * mongodb compass connection string
     */
    mongooseConnectionString: string;
}

export interface reconDBSchema {
    key: string;
    value: any;
}
