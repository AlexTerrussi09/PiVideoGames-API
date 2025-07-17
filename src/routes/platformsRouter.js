const express = require('express');
const platformsRouter = express.Router();
const { Plataforma } = require('../db')

platformsRouter.get('/', async (req, res) => {
    try {
        const plataformas = await Plataforma.findAll();
        res.status(200).send(plataformas)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
platformsRouter.post('/bulk', async (req, res) => {
    try {
        const data = req.body;
        const newPlatform = await Plataforma.bulkCreate(data);
        res.status(201).send(newPlatform)

    } catch (error) {
        res.status(400).send(error.message)
    }
});

module.exports = platformsRouter;