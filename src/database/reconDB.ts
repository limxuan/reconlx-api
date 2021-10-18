import mongoose, { Schema } from "mongoose";
import { Client, Collection } from "discord.js";

interface reconDBEvents {
    ready: (reconDB: reconDB) => unknown;
}

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

    constructor(mongooseConnectionString: string) {
        if (mongoose.connection.readyState !== 1) {
            if (!mongooseConnectionString)
                throw new Error(
                    "There is no established  connection with mongoose and a mongoose connection is required!"
                );

            mongoose.connect(mongooseConnectionString);
        }
        this.ready();
    }

    private async ready() {
        await this.schema.find({}).then((data) => {
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
    public delete(key: string) {
        if (!key) return;
        this.schema.findOne({ key }, async (err, data) => {
            if (err) throw err;
            if (data) await data.delete();
        });
        this.dbCollection.delete(key);
    }

    /**
     * @method
     * @param key The key you wish to get data
     * @description Gets data from the database with a key
     * @example <reconDB>.get('key1')
     */
    public get(key: string): any {
        if (!key) return;
        return this.dbCollection.get(key);
    }

    /**
     * @method
     * @param key The key you wish to push data to
     * @description Push data to the an array with a key
     * @example
     */
    public push(key: string, ...pushValue: any) {
        const data = this.dbCollection.get(key);
        const values = pushValue.flat();
        if (!Array.isArray(data))
            throw Error(`You cant push data to a ${typeof data} value!`);

        data.push(pushValue);
        this.schema.findOne({ key }, async (err, res) => {
            res.value = [...res.value, ...values];
            res.save();
        });
    }

    /**
     * @method
     * @returns Cached data with discord.js collection
     */
    public collection(): Collection<string, any> {
        return this.dbCollection;
    }
}

export interface reconDBSchema {
    key: string;
    value: any;
}
