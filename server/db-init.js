const { connectDB, STORE_SETTING, DB_NAME, openCard } = require('./db')

connectDB(DB_NAME).then(async ({ db, close }) => {
    const card = openCard(db, STORE_SETTING);
    await card.add({ id: 'read_default_view', value: ["front", "picture"] });
    await card.add({ id: "spell_default_view", value: ["back", "picture"] });
    await card.add({ id: "recall_default_view", value: ["picture"] })
    await card.add({ id: "default_cards_view", value: "front" })
    close()
})