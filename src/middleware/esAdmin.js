const path = require('path');

function noEstaLogeado(req,res,next) {
    if(req.session.usuarioLogeado && req.session.usuarioLogeado.categoria=="Admin") {
        next();
    } else {
        res.render(path.join(__dirname,'../views/users/login.ejs'), {errorLogeo:"Para continuar debe loguearse como Admin"});
    }
}

module.exports = noEstaLogeado;