import {
    openDB,
    deleteDB,
    wrap,
    unwrap
} from "idb";


export const STORE_CARD = 'card'

const DB_CONFIG = {
    name: 'flashcards',
    version: 1,
    stores: [{
        name: STORE_CARD,
        config: {
            keyPath: "id",
            autoIncrement: true
        },
        indexName: 'id'
    }]
}


async function getDB() {
    return openDB(DB_CONFIG.name, DB_CONFIG.version, {
        upgrade(db) {
            DB_CONFIG.store.map(store => {
                if (!db.objectStoreNames.contains(store.name)) {
                    const store = db.createObjectStore(store.name, store.config);
                    store.createIndex(store.indexName, store.indexName);
                    console.info(`store [${store.name}] created`);
                }
            })
        }
    });
}

export function createStoreConnect(storeName) {
    const _api = {
        add: function (record) {
            return _api.batchAdd([record])
        },
        batchAdd: async function (records) {
            const db = await getDB()
            if (records.length === 1) {
                return db.add(storeName, {
                    ...records[0],
                    created: new Date().getTime()
                })
            }
            const tx = db.transaction('batchAdd', "readwrite");
            records.map(record => {
                tx.objectStore(storeName).add({
                    ...record,
                    created: new Date().getTime()
                });
            })
            return tx.complete;
        },
        delete: function (id) {
            return _api.batchDelete([id])
        },
        batchDelete: async function (ids) {
            const db = await getDB()
            if (ids.length === 1) {
                return db.delete(storeName, ids[0])
            }
            const tx = db.transaction('batchDelete', "readwrite");
            ids.map(id => tx.objectStore(storeName).delete(id))
            await tx.complete;
        },
        modify: function (record, option) {
            return _api.batchModify([record], option)
        },
        batchModify: async function (records, option) {
            const db = await getDB()
            const {
                incrementModif
            } = option || {};
            if (records.length === 1) {
                return db.put(storeName, {
                    ...records[0],
                    updated: new Date().getTime()
                })
            }
            const tx = db.transaction(storeName, "readwrite");

            records.map(async record => {
                if (incrementModif) {
                    const oldRecord = await db.get(storeName, record.id);
                    record = {
                        ...oldRecord,
                        ...record
                    };
                }
                tx.objectStore(storeName).put({
                    ...record,
                    updated: new Date().getTime()
                });
            })

            await tx.complete;
        },
        queryById: function (id) {
            return getDB().then(db => db.get(storeName, id))
        },
        query: function (params) {
            return getDB().then(db => db.getAll(storeName, params))
        }
    }
    return _api
}