const express = require('express');
const genresRouter = express.Router();
const { Genero } = require('../db'); 
const { getAllGenres } = require('../helpers/helpers');

genresRouter.get('/', async (req, res) => {
        try {
            const genero = await Genero.findAll()
                res.status(200).json(genero)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
genresRouter.post('/bulk', async (req, res) => {
    try {
        const data = req.body;
        const newGenres = await Genero.bulkCreate(data);
        res.status(201).send(newGenres)
        
    } catch (error) {
        res.status(400).send(error.message)
    }
});

module.exports = genresRouter;