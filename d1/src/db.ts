import { openDB, deleteDB, wrap, unwrap } from "idb";

interface Card {
  front: string;
  back: string;
  picture?: string;
  tags?: string[];
}

export interface CardStore extends Card {
  id: number;

  created: number;
  updated: number;

  // 复习等级
  readLevel: number;
  spellLevel: number;
  recallLevel: number;

  // 最后复习时间的时间戳
  lastRead?: number;
  lastSpell?: number;
  lastRecall?: number;
}

export interface StoreModifyOption {
  incrementModif: boolean;
}

export interface KVStore {
    id: string;
    value: any;
}
// remind levels = [13]
// read card default = ['front', 'picture']
// spell card default = ['back', 'picture']
// recall card default = ['picture']

export const STORE_CARD = "card";
export const STORE_SETTING = "setting";

const DB_CONFIG = {
  name: "flashcards",
  version: 2,
  stores: [
    {
      name: STORE_CARD,
      config: {
        keyPath: "id",
        autoIncrement: true
      },
      indexName: "id"
    },
    {
      name: STORE_SETTING,
      config: {
        keyPath: "id"
      },
      indexName: "id"
    }
  ]
};

async function getDB() {
  return openDB(DB_CONFIG.name, DB_CONFIG.version, {
    upgrade(db) {
      DB_CONFIG.stores.map(record => {
        if (!db.objectStoreNames.contains(record.name)) {
          const store = db.createObjectStore(record.name, record.config);
          store.createIndex(record.indexName, record.indexName);
          console.info(`store [${store.name}] created`);
        }
      });
    }
  });
}

export function createStoreConnect<T extends { id: number }>(
  storeName: string
) {
  const _api = {
    add: function(record: T) {
      return _api.batchAdd([record]);
    },
    batchAdd: async function(records: T[]) {
      const db = await getDB();
      if (records.length === 1) {
        return db.add(storeName, {
          ...records[0],
          created: new Date().getTime()
        });
      }
      const tx = db.transaction(storeName, "readwrite");
      records.map(record => {
        tx.objectStore(storeName).add({
          ...record,
          created: new Date().getTime()
        });
      });
      return tx.done;
    },
    delete: function(id: number) {
      return _api.batchDelete([id]);
    },
    batchDelete: async function(ids: number[]) {
      const db = await getDB();
      if (ids.length === 1) {
        return db.delete(storeName, ids[0]);
      }
      const tx = db.transaction(storeName, "readwrite");
      ids.map(id => tx.objectStore(storeName).delete(id));
      await tx.done;
    },
    modify: function(record: T, option: StoreModifyOption) {
      return _api.batchModify([record], option);
    },
    batchModify: async function(records: T[], option: StoreModifyOption) {
      const db = await getDB();
      const { incrementModif } = (option || {}) as StoreModifyOption;
      if (records.length === 1) {
        return db.put(storeName, {
          ...records[0],
          updated: new Date().getTime()
        });
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
      });

      await tx.done;
    },
    queryById: function(id: number) {
      return getDB().then(db => db.get(storeName, id));
    },
    query: function(params: any) {
      return getDB().then(db => db.getAll(storeName, params));
    }
  };
  return _api;
}
