const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://superuser:changeMeToAStrongPassword@localhost:27017/?authSource=admin&readPreference=primary&ssl=false';
const DB_NAME = 'flashcard'
const STORE_CARD = 'card'
const STORE_SETTING = 'setting'

// Use connect method to connect to the Server
// MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
//     assert.equal(null, err);

//     const db = client.db("admin");
//     db.collection('test').insertOne({
//         item: "canvas",
//         qty: 100,
//         tags: ["cotton"],
//         size: { h: 28, w: 35.5, uom: "cm" }
//     })
//         .then(function (result) {
//             console.log('inserted!')
//             db.collection('test').insertOne({
//                 item: "canvas1",
//                 qty: 101,
//                 tags: ["cotton1"],
//                 size: { h: 28, w: 35.5, uom: "cm" }
//             })
//             console.log('inserted2!')
//             // process result
//         })
//     client.close();
// });


function connectDB(tableName) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
            assert.equal(null, err);
            if (!err) {
                const db = client.db(tableName);
                resolve({ db, close: function close() { client.close() } });
                return;
            }
            reject(err)
        });
    })
}

function openCard(db, store) {
    const ts = db.collection(store);
    return {
        add(item) {
            return ts.insertOne(item)
        },
        batchAdd(items) {
            return ts.insertMany(items)
        },
        delete(key) {
            return ts.deleteOne({
                id: key
            })
        },
        batchDelete(keys) {
            return ts.deleteMany(keys.map(key => ({ id: key })))
        },
        modify(record, option) {
            return ts.updateOne(
                { id: record.id },
                {
                    $set: record,
                    $currentDate: { lastModified: true }
                })
        },
        batchModify(records, option) {

        },
        query(pattern) {
            return ts.find(pattern).sort({ created: -1 }).toArray()
        },
        queryAll() {
            return ts.find({}).toArray()
        }
    }
}

function openSetting(db) {
    const ts = db.collection(STORE_SETTING);
    return {
        add(item) {
            return ts.insertOne(item)
        },
        batchAdd(items) {
            return ts.insertMany(items)
        },
        delete(key) {
            return ts.deleteOne({
                id: key
            })
        },
        batchDelete(keys) {
            return ts.deleteMany(keys.map(key => ({ id: key })))
        },
        modify(record, option) {
            return ts.updateOne(
                { id: record.id },
                {
                    $set: record,
                    $currentDate: { lastModified: true }
                })
        },
        batchModify(records, option) {

        },
        query(pattern) {
            return ts.find(pattern)
        },
        queryAll() {
            return ts.find({})
        }
    }
}

module.exports = { connectDB, DB_NAME, STORE_CARD, STORE_SETTING, openCard, openSetting }

// connectDB(DB_NAME).then(async ({ db, close }) => {
//     const card = openCard(db, STORE_CARD);
//     const item = await card.add({ id: '1', name: 'wjc', age: '15' });
//     console.log('add ==>', item);
//     {
//         const results = card.queryAll();
//         assert(1, results.length)
//     }
//     {
//         await card.modify({ id: '1', age: '16' })
//     }
//     {
//         const results = await card.query({ id: '1' });
//         assert(1, results.length)
//         results.forEach(item => assert('16', item.age))
//     }
//     {
//         await card.delete('1')
//     }
//     close()
// })