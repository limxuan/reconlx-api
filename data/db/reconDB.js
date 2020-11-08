const mongoose = require('mongoose')
class reconDB {
    constructor(options) {
      mongoose.connect(options.uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }).then(console.log('Connected to reconDB ✅'))
      this.model = require(require('path').join(__dirname, 'schema.js'))
    }
    async set(key, value) {
        if(!key) throw new TypeError(`reconDB => Please specify a "key"`)
        if(!value) throw new TypeError(`reconDB => Please specify a "value"`)
        this.model.findOne({ key : key }, async(err, data) => {
            if(err) throw err;
            if(data) {
                data.value = value;
                data.save()
            } else {
                data = new this.model({key : key, value : value})
                data.save()
            }
        })
    }
    async get(key) {
        if(!key) throw new TypeError(`reconDB => Please specify a "key"`)
        let DATA;
        const data = await this.model.findOne({ key : key })
            .catch(err => console.log(err))
        if(data) {
            DATA = data.value
        } else {
            DATA = undefined;
        }
        return DATA;
    }
    async has(key) {
        if(!key) throw new TypeError(`reconDB => Please specify a "key"`)
        return !!(await this.get(key))
    }
    async delete(key) {
        if(!key) throw new TypeError(`reconDB => Please specify a "key"`)
        this.model.findOne({ key: key}, async(err, data) => {
            if(err) throw err;
            if(data) {
                this.model.findOneAndDelete({ key : key })
                    .catch(err => console.log(err))
            } else {
                throw new TypeError(`reconDB => Data does not exist`)
            }
        })
    }
}
module.exports = reconDB;