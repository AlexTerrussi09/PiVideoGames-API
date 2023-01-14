const express = require('express');
const { getAllVideogamesApi, getVideogameApiById } = require('../helpers/helpers');
const videogamesRouter = express.Router();
const {  Videogame, Genero, Plataforma }=require('../db')

videogamesRouter.get('/',  async (req, res) => {
    const { name } = req.query
    try {
        let juegosApi = await getAllVideogamesApi()
        let juegos = await Videogame.findAll({
            include: [{ model: Genero, attributes: ['name'], through: { attributes: [] } },
                    {model: Plataforma, attributes: ['name'], through: { attributes: [] }}]
        })
        let juegosTotales = juegos.concat(juegosApi)
        if (!name) {
            res.status(200).json(juegosTotales)
        } else {
            let arrayEnviar = []
            let i = 0;
            while (true) {
                if (arrayEnviar.length === 15) break
                if (i === juegosTotales.length - 1) break
                let arrayName = juegosTotales[i].name.split(" ").join("").toLowerCase()
                let busqueda = name.split(" ").join("").toLowerCase()
                if (arrayName.includes(busqueda)) {
                    arrayEnviar.push(juegosTotales[i])
                }
                i++
            }
            if (arrayEnviar.length>0) {
                return res.status(200).json(arrayEnviar)
            } else {
                return res.status(404).send(`El juego ${name} no existe`)
            }
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})
videogamesRouter.get('/:idVideogame',async (req, res) => {
    const { idVideogame } = req.params
    try {
        if (String(Number(idVideogame)) === "NaN") {
            let juegoDb = await Videogame.findOne({
                where : {id : idVideogame},
                include: [{ model: Genero, attributes: ['name'], through: { attributes: [] } },
                    {model: Plataforma, attributes: ['name'], through: { attributes: [] }}]
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
         name ,
         rating ,
         description,
         releaseDate,
         background_image 
        });
        res.status(200).send(juego)
    } catch (error) {
        
    }}
    )


module.exports = videogamesRouter;