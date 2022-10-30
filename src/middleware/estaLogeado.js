const path = require('path'); 

function estaLogeado(req,res,next) {
    if(req.session.usuarioLogeado) {
        next();
    } else {
//      res.redirect('/user/login');
        res.render(path.join(__dirname,'../views/users/login.ejs'), {errorLogeo:"Debe loguearse para ver el carrito"});
    }
}

module.exports = estaLogeado;