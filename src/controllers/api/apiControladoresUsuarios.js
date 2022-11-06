const db = require('../../../database/models');
const sequelize = db.sequelize;

const apiControladoresUsuarios = {
    list: (req, res) => {
        db.users.findAll()
        .then(
            users => {
                let response = {
                    meta: {
                        status: 200,
                        total: users.length,
                        url: 'api/users'
                    },
                    data: users
                }
                res.json(response);
            }
        )
        .catch( error => res.send(error))
    },

    detail: (req, res) => {
        db.users.findByPk(req.params.id)
        .then(
            users => {
                let response = {
                    meta: {
                        status: 200,
                        url: 'api/users/:id'
                    },
                    data: users
                }
            res.json(response);
            }
        )
        .catch(error => res.send(error))
    },

}

module.exports = apiControladoresUsuarios;