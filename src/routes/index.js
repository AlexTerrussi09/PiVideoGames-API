const { Router } = require('express');
const express = require('express');
const genresRouter = require('./genresRouter');
const videogamesRouter = require('./videogamesRouter');
const cors = require('cors');
const platformsRouter = require('./platformsRouter');
const router = Router();

router.use(express.json());
router.use(cors())
router.use('/videogames', videogamesRouter)
router.use('/genres', genresRouter)
router.use('/platforms', platformsRouter)

module.exports = router;
