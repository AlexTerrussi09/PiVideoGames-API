
const { Genero, Videogame, Plataforma } = require('../db')
const { getAllGenres, getAllVideogamesApi, getAllPlatforms } = require('./helpers.js')

module.exports = {
    buscarGeneros: async () => {
        try {
            let generos = await getAllGenres()
            await Genero.bulkCreate(generos)

        } catch (error) {
            Error("Error")
        }
    },
    buscarJuegos: async () => {
        try {
            let juegos = await getAllVideogamesApi()
            console.log("JUEGOS-------------------------------\n", juegos)
            await Videogame.bulkCreate(juegos)

        } catch (error) {
            Error("Error")
        }
    },
    buscarPlataformas: async () => {
        try {
            let plat = getAllPlatforms()
            await Plataforma.bulkCreate(plat)

        } catch (error) {
            Error("Error")
        }
    }

}