function localsMiddle(req,res,next) {
    res.locals.usuario = null;
    if (req.session.usuarioLogeado) {
        res.locals.usuario=req.session.usuarioLogeado;
    }
    next();
}

module.exports = localsMiddle;