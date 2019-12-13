const { connectDB, DB_NAME, STORE_CARD, STORE_SETTING, openCard, openSetting } = require('./db');

module.exports = function route(app) {
    app.all('/api/card/:option', async (req, res) => {
        const body = req.body;
        const option = req.params.option;
        console.log('req.route1', option)
        console.log('body', body)
        const { db, close } = await connectDB(DB_NAME)
        try {
            const card = openCard(db, STORE_CARD);
            switch (option) {
                case 'add': {
                    await card.add({ ...body, id: Math.random().toString(36).substr(2), created: new Date().toISOString() });
                    res.status(200).json({ status: 'ok' })
                    break;
                }
                case 'batchAdd': {
                    await card.batchAdd(body.map(item => ({ ...item, id: Math.random().toString(36).substr(2), created: new Date().toISOString() })));
                    res.status(200).json({ status: 'ok' })
                    break;
                }

                case 'list': {
                    const result = await card.query(body.ql);
                    res.status(200).json({ status: 'ok', data: result })
                    break;
                }
                case 'modify': {
                    await card.modify(body);
                    res.status(200).json({ status: 'ok' })
                    break;
                }
                case 'delete': {
                    await card.delete(req.query.id);
                    res.status(200).json({ status: 'ok' })
                    break;
                }
                default: {
                    console.log('option', option)
                }
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err, message: err.message })
        } finally {
            close()
        }

    })
    app.all('/api/setting/:option', async (req, res) => {
        const body = req.body;
        const option = req.params.option;
        console.log('req.route', req.params)
        console.log('body', body)
        const { db, close } = await connectDB(DB_NAME)
        try {
            const setting = openCard(db, STORE_SETTING);
            switch (option) {
                case 'list': {
                    const result = await setting.query(body.ql);
                    res.status(200).json({ status: 'ok', data: result })
                    break;
                }
                case 'modify': {
                    await setting.modify(body);
                    res.status(200).json({ status: 'ok' })
                    break;
                }
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err, message: err.message })
        } finally {
            close()
        }

    })
}