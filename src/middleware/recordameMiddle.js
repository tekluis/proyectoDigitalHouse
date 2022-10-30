const fs = require("fs");
const path = require('path'); 

function cargarUsuarios(){
    const jsonData = fs.readFileSync(path.join(__dirname, "../data/users.json"));
    const data = JSON.parse(jsonData);
    return data
}

function recordameMiddle(req,res,next) {   
    const usuarios = cargarUsuarios(); 
    if (req.cookies.recuerdame && !(req.session.usuarioLogeado)) {

        let indiceEncontrado = usuarios.findIndex(usuario => {
            return usuario.id == req.cookies.recuerdame;
        })        

        req.session.usuarioLogeado = {
            id: usuarios[indiceEncontrado].id,
            nombre: usuarios[indiceEncontrado].nombre,
        }
    }
    next();
}

module.exports = recordameMiddle;