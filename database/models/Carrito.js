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
        id_productos : {
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

    return Carrito;
}