module.exports = (sequelize, dataTypes) => {
    
    let alias = 'carrito';

    let cols = {
        id : {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_users : {
            type : dataTypes.INTEGER 
        },
        id_products : {
            type : dataTypes.INTEGER
        }
    };

    let config = {
        timestamps : false,
        tableName : 'carrito',
  //      createdAt : 'created_at',
  //      updatedAt : 'updated_at'
    };

    const Carrito = sequelize.define(alias, cols, config);

    Carrito.associate = function(models) {
        Carrito.belongsTo(models.products, { // models.Movies -> Movie es el valor de alias en movie.js
            as: "products", // El nombre del modelo pero en plural
            foreignKey: "id_products"
        })
    }

    return Carrito;
}