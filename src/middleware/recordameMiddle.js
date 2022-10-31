const db = require ('../../database/models')
const { Op } = require("sequelize");


function recordameMiddle(req,res,next) {   

    if (req.cookies.recuerdame && !(req.session.usuarioLogeado)) {
        db.users.findOne({
            where:{id:req.cookies.recuerdame}
        })
        .then((usuarioEncontrado)=>{
            req.session.usuarioLogeado = {
                id: usuarioEncontrado.id,
                nombre: usuarioEncontrado.nombre
            }
            next();
        })
    } else {
        next();
    }

}

module.exports = recordameMiddle;