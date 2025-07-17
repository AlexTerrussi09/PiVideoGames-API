require('dotenv').config();
const { API_KEY } = process.env
const { Videogame, Genero, Plataforma } = require("../db");
const axios = require('axios')
module.exports = {
    loadInitialData: async () => {
        
        try {
            const totalPages = 5;
            const urls = Array.from({ length: totalPages }, (_, i) =>
                `https://api.rawg.io/api/games?key=${API_KEY}&page=${i + 1}`
            );

            const responses = await Promise.all(
                urls.map(url => axios.get(url).then(res => res.data.results))
            );

            const juegosApi = responses.flat();

            for (const juego of juegosApi) {
                const videogame_description = await axios.get(`https://api.rawg.io/api/games/${juego.id}?key=${API_KEY}`).then(res => res.data.description_raw ) || "No description available";
                const [videojuego, created] = await Videogame.findOrCreate({
                    where: { name: juego.name },
                    defaults: {
                        background_image: juego.background_image,
                        rating: juego.rating,
                        releaseDate: juego.released,
                        description:  videogame_description,

                    }
                });
                // const juego = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
                // let arrayObj = [juego.data].map(ele => ({
                //     id: ele.id,
                //     name: ele.name,
                //     background_image: ele.background_image,
                //     Generos: ele.genres.map(gen => gen.name),
                //     description: ele.description_raw,
                //     releaseDate: ele.released,
                //     rating: ele.rating,
                //     Plataformas: ele.platforms.map(plat => plat.platform.name)
                // }))

                // Cargar géneros
                for (const g of juego.genres) {
                    const [genero] = await Genero.findOrCreate({
                        where: { name: g.name }
                    });
                    await videojuego.addGenero(genero);
                }

                // Cargar plataformas
                for (const p of juego.platforms || []) {
                    const nombrePlataforma = p.platform?.name;
                    if (!nombrePlataforma) continue;
                    const [plataforma] = await Plataforma.findOrCreate({
                        where: { name: nombrePlataforma }
                    });
                    await videojuego.addPlataforma(plataforma);
                }
            }

            console.log("✅ Datos iniciales cargados exitosamente.");

        } catch (error) {
            console.error("❌ Error al cargar datos iniciales:", error.message);
        }
    }
}
