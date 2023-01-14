const { Router } = require('express');
const express = require('express');
const genresRouter = require('./genresRouter');
const videogamesRouter = require('./videogamesRouter');
const cors = require('cors');
const platformsRouter = require('./platformsRouter');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use(express.json());
router.use(cors())
router.use('/videogames', videogamesRouter)
router.use('/genres', genresRouter)
router.use('/platforms', platformsRouter)

module.exports = router;
