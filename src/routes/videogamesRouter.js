const express = require('express');
const { getAllVideogamesApi, getVideogameApiById } = require('../helpers/helpers');
const videogamesRouter = express.Router();
const { Videogame, Genero, Plataforma } = require('../db')

videogamesRouter.get('/', async (req, res) => {
    const { name } = req.query;

    try {
        const juegosDb = await Videogame.findAll({
            include: [
            { model: Genero, attributes: ['name'], through: { attributes: [] } },
            { model: Plataforma, attributes: ['name'], through: { attributes: [] } }
            ]
        });
        console.log("juegosDb=========================\n", juegosDb.slice(0, 5))

        const juegos = juegosDb.map(juego => ({
            ...juego.toJSON(),
            Generos: juego.Generos || juego.Generos ? juego.Generos : juego.Generos,
            Plataformas: juego.Plataformas || juego.Plataformas ? juego.Plataformas : juego.Plataformas
        }));
        console.log("juegos====================================\n", juegos.slice(0, 5))


        if (!name) {
            return res.status(200).json(juegos);
        }

        const search = name.replace(/\s+/g, '').toLowerCase();

        const coincidencias = juegos
            .filter(juego =>
                juego.name.replace(/\s+/g, '').toLowerCase().includes(search)
            )
            .slice(0, 15);

        if (coincidencias.length === 0) {
            return res.status(404).send(`No se encontró ningún juego con el nombre "${name}"`);
        }

        return res.status(200).json(coincidencias);

    } catch (error) {
        console.error("Error al obtener videojuegos:", error);
        return res.status(500).send("Error interno del servidor");
    }
});


videogamesRouter.get('/:idVideogame', async (req, res) => {
    const { idVideogame } = req.params
    try {
        if (String(Number(idVideogame)) === "NaN") {
            let juegoDb = await Videogame.findOne({
                where: { id: idVideogame },
                include: [{ model: Genero, attributes: ['name'], through: { attributes: [] } },
                { model: Plataforma, attributes: ['name'], through: { attributes: [] } }]
            })
            return res.status(200).send(juegoDb)
        } else {
            let juegoApi = await getVideogameApiById(idVideogame)
            return res.status(200).send(juegoApi)
        }
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