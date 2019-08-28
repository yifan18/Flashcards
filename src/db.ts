import { openDB, deleteDB, wrap, unwrap } from "idb";
import { generateLevels } from "./ishobin.js";
interface Card {
  front: string;
  back: string;
  picture: string;
  tags: string[];
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
  version: 1,
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
  let newCreated = {};
  const db = await openDB(DB_CONFIG.name, DB_CONFIG.version, {
    upgrade(db) {
      DB_CONFIG.stores.map(record => {
        if (!db.objectStoreNames.contains(record.name)) {
          const store = db.createObjectStore(record.name, record.config);
          store.createIndex(record.indexName, record.indexName);
          console.info(`store [${store.name}] created`);
          newCreated[store.name] = true;
        }
      });
    }
  });

  // 初始化kv
  if (newCreated[STORE_SETTING]) {
    const tx = db.transaction(STORE_SETTING, "readwrite");
    const store = tx.objectStore(STORE_SETTING);

    // 清空设定
    let next = await store.index("id").openCursor();
    while (next) {
      store.delete(next.value.id);
      next = await next.continue();
    }

    // 新增
    store.add({
      id: "read_default_view",
      value: ["front", "picture"]
    });
    store.add({
      id: "spell_default_view",
      value: ["back", "picture"]
    });
    store.add({ id: "recall_default_view", value: ["picture"] });
    store.add({ id: "default_cards_view", value: "front" });
    await tx.done;
  }

  return db;
}

export function createStoreConnect<
  T extends { id: number | string; [key: string]: any }
>(storeName: string) {
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

      // if (records.length === 1) {
      //   const record = await db.get(storeName, records[0].id);
      //   return db.put(storeName, {
      //     ...record,
      //     ...records[0],
      //     updated: new Date().getTime()
      //   });
      // }

      if (incrementModif) {
        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          const old = await db.get(storeName, record.id);
          records[i] = { ...old, ...record };
        }
      }

      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      for (let i = 0; i < records.length; i++) {
        store.put({ ...records[i], updated: Date.now() });
      }
      await tx.done;
    },
    queryById: function(id: number | string) {
      return getDB().then(db => db.get(storeName, id));
    },
    query: async function(callback?: (T) => boolean) {
      const db = await getDB();

      if (!callback) return db.getAll(storeName);

      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const index = store.index("id");

      const list: T[] = [];
      let cursor = await index.openCursor();

      while (true) {
        if (!cursor || !cursor.value) break;
        if (callback(cursor.value)) list.push(cursor.value);
        await cursor.continue().then(next => {
          cursor = next;
        });
      }
      await tx.done;
      return list;
    }
  };
  return _api;
}
