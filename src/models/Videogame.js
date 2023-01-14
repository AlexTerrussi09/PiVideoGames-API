const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Videogame', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name : {
      type : DataTypes.STRING,
      allowNull : false,
      unique: true
    },
    description : {
      type : DataTypes.TEXT,
      allowNull : false
    },
    releaseDate : {
      type : DataTypes.DATEONLY,
      allowNull: false
    },
    rating : {
      type : DataTypes.FLOAT,
      defaultValue: 1.0
    },
    background_image: {
      type: DataTypes.STRING,
      defaultValue : 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg'
    },
  },
  {timestamps : false});
};
