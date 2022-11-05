module.exports = (sequelize, dataTypes) => {
    
    let alias = 'products';

    let cols = {
        id : {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre : {
            type : dataTypes.STRING 
        },
        precio : {
            type : dataTypes.STRING 
        },
        categoria : {
            type : dataTypes.STRING 
        },
        tamano : {
            type : dataTypes.STRING 
        },
        descuento : {
            type : dataTypes.STRING
        },
        imagen : {
            type : dataTypes.STRING
        }
    };

    let config = {
        timestamps : false,
        tableName : 'products',
  //      createdAt : 'created_at',
  //      updatedAt : 'updated_at'
    };

    const Products = sequelize.define(alias, cols, config);

    Products.associate = function (models) {
        
        Products.belongsToMany(models.users, { // models.Movie -> Movies es el valor de alias en movie.js
            as: "users",
            through: 'carrito',
            foreignKey: 'id_products',
            otherKey: 'id_users',
            timestamps: false
        }),

        Products.hasMany(models.carrito, { // models.Genre -> Genres es el valor de alias en genres.js
            as: "carritos",
            foreignKey: "id_products"
        })
    }



    return Products;
}