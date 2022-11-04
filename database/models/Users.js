module.exports = (sequelize, dataTypes) => {
    
    let alias = 'users';

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
        apellido : {
            type : dataTypes.STRING 
        },
        categoria : {
            type : dataTypes.STRING 
        },
        email : {
            type : dataTypes.STRING 
        },
        password : {
            type : dataTypes.STRING
        },
        imagen : {
            type : dataTypes.STRING
        }
    };

    let config = {
        timestamps : false,
        tableName : 'users',
  //      createdAt : 'created_at',
  //      updatedAt : 'updated_at'
    };

    const Users = sequelize.define(alias, cols, config);


    Users.associate = function (models) {
        Users.belongsToMany(models.products, { // models.Movie -> Movies es el valor de alias en movie.js
            as: "products",
            through: 'carrito',
            foreignKey: 'id_users',
            otherKey: 'id_products',
            timestamps: false
        })
    }

    return Users;
}