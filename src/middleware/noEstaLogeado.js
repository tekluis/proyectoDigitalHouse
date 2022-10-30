function noEstaLogeado(req,res,next) {
    if(req.session.usuarioLogeado) {
        res.redirect('/user/list');
    } else {
        next();
    }
}

module.exports = noEstaLogeado;