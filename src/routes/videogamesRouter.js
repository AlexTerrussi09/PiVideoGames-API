const express = require('express');
const videogamesRouter = express.Router();
const { Videogame, Genero, Plataforma } = require('../db');
const { Op } = require('sequelize');


videogamesRouter.get('/', async (req, res) => {
  const { name, genero, plataforma } = req.query;

  try {
    let where = {};
    const filters = [];

    // 1. Filtrar por géneros
    if (genero) {
      const generos = genero.split(',').map(g => g.trim());

      const juegosConGenero = await Videogame.findAll({
        include: {
          model: Genero,
          where: { name: { [Op.in]: generos } },
          attributes: [],
          through: { attributes: [] }
        },
        attributes: ['id']
      });

      const idsGenero = juegosConGenero.map(j => j.id);
      filters.push(idsGenero);
    }

    // 2. Filtrar por plataformas
    if (plataforma) {
      const plataformas = plataforma.split(',').map(p => p.trim());

      const juegosConPlataforma = await Videogame.findAll({
        include: {
          model: Plataforma,
          where: { name: { [Op.in]: plataformas } },
          attributes: [],
          through: { attributes: [] }
        },
        attributes: ['id']
      });

      const idsPlataforma = juegosConPlataforma.map(j => j.id);
      filters.push(idsPlataforma);
    }

    // 3. Intersección de filtros
    if (filters.length > 0) {
      const idsFinales = filters.reduce((a, b) => a.filter(id => b.includes(id)));
      where.id = { [Op.in]: idsFinales };
    }

    // 4. Buscar videojuegos con todos sus géneros y plataformas
    let videojuegos = await Videogame.findAll({
      where,
      include: [
        {
          model: Genero,
          attributes: ['name'],
          through: { attributes: [] }
        },
        {
          model: Plataforma,
          attributes: ['name'],
          through: { attributes: [] }
        }
      ]
    });

    // 5. Filtrado por nombre si se pide
    if (name) {
      const normalizado = name.replace(/\s+/g, '').toLowerCase();
      videojuegos = videojuegos.filter(j =>
        j.name.replace(/\s+/g, '').toLowerCase().includes(normalizado)
      );
    }

    if (videojuegos.length === 0) {
      return res.status(404).send("No se encontraron videojuegos con esos filtros.");
    }

    const formateados = videojuegos.map(j => ({
      id: j.id,
      name: j.name,
      background_image: j.background_image,
      rating: j.rating,
      releaseDate: j.releaseDate,
      Generos: j.Generos.map(g => g.name),
      Plataformas: j.Plataformas.map(p => p.name),
      description: j.description
    }));

    res.status(200).json(formateados);

  } catch (error) {
    console.error("Error al filtrar videojuegos:", error.message);
    res.status(500).send("Error interno del servidor.");
  }
});

videogamesRouter.get('/:idVideogame', async (req, res) => {
    const { idVideogame } = req.params
    try {
        let juegoDb = await Videogame.findOne({
            where: { id: idVideogame },
            include: [{ model: Genero, attributes: ['name'], through: { attributes: [] } },
            { model: Plataforma, attributes: ['name'], through: { attributes: [] } }]
        })
        return res.status(200).send(juegoDb)
    }
    catch (error) {
        res.status(400).send(error.message)
    }
});
videogamesRouter.post('/', async (req, res) => {
    console.log(req.body)
    const { name, background_image, platforms, genres, rating, releaseDate, description } = req.body;
    try {

        const newProject = await Videogame.create({
            name,
            background_image,
            rating,
            releaseDate,
            description
        })
        const allGenres = await Genero.findAll({ where: { name: genres } })
        const allPlatforms = await Plataforma.findAll({ where: { name: platforms } })
        await newProject.addPlataforma(allPlatforms)
        await newProject.addGenero(allGenres)
        res.status(201).json(`Juego ${newProject.dataValues.name} creado`)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
videogamesRouter.post('/bulk', async (req, res) => {
    const data = req.body;
    try {
        const newVideogames = await Videogame.bulkCreate(data);
        res.status(201).send(newVideogames)
    } catch (error) {
        res.status(400).send(error.message)
    }
});
videogamesRouter.delete('/:idVideogame', async (req, res) => {
    const { idVideogame } = req.params;
    try {
        const juego = await Videogame.findByPk(idVideogame);
        await juego.destroy();
        res.status(200).send(juego)
    } catch (error) {

    }
})
videogamesRouter.put('/', async (req, res) => {
    const { name, rating, description, Plataformas, Generos, releaseDate, background_image, id } = req.body;
    try {
        const juego = await Videogame.findByPk(id);
        await juego.update({
            name,
            rating,
            description,
            releaseDate,
            background_image
        });
        res.status(200).send(juego)
    } catch (error) {

    }
}
)


module.exports = videogamesRouter;