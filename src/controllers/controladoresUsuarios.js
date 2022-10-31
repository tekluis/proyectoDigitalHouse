const db = require ('../../database/models')
const { Op } = require("sequelize");

const path = require('path');                                           // habilita path
const bcrypt = require("bcryptjs");
const {validationResult} = require('express-validator');


let controladores = {
    
    usersList: function(req,res) {
        db.users.findAll({
            order:[['id','ASC']],
            offset:0,
            limit:100
        })
        .then((usuarios) => {
            res.render(path.join(__dirname,'../views/users/usersList.ejs'), {usuario:usuarios}); 
        })
    },

    userDetail: function(req,res) {
        db.users.findByPk(req.params.id)
        .then((usuarioEncontrado) => {
            res.render(path.join(__dirname,'../views/users/userDetail.ejs'), { user : usuarioEncontrado});
        })
    },

    login:  function(req,res) {
        res.render(path.join(__dirname,'../views/users/login.ejs'));          // devuelve la página login.ejs al llamar a controlador.login
    },
    
    register:  function(req,res) {
        res.render(path.join(__dirname,'../views/users/register.ejs'));
    },

    crearUsuario: function(req,res) {
        let errors=validationResult(req);

        if (errors.isEmpty() && req.file) {
            db.users.create({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                categoria: req.body.categoria,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                imagen: req.file.filename 
            })
            .then(res.redirect('/product/list'));                                              // envía a la página de home luego de cargar los datos del formulario

        } else {
            res.render(path.join(__dirname,'../views/users/register.ejs'), {errors:errors.mapped(), old:req.body});
        }
    },

    borrarUsuario: function(req,res) {
        db.users.destroy ({
            where: {id:req.params.id}
        })
        .then(res.redirect('/user/list'))
    },

    salir: function(req,res) {
        req.session.destroy();
        res.clearCookie("recuerdame");
        res.redirect('/')
    },


    entrar: function(req,res) {

        db.users.findOne({
            where:{email:req.body.email}
        })
        .then((usuarioEncontrado) => {
            if((usuarioEncontrado!=null)&&(bcrypt.compareSync(req.body.password,usuarioEncontrado.password)))
                {
                    req.session.usuarioLogeado = {
                        id: usuarioEncontrado.id,
                        nombre: usuarioEncontrado.nombre,
                    }
            
                    if(req.body.recordar) {
                        res.cookie("recuerdame", usuarioEncontrado.id, {maxAge:5*60*1000});   // cookie por 5 minutos
                    }
            
                    res.redirect('/');

                }else{
                    res.render(path.join(__dirname,'../views/users/login.ejs'), {errorIngreso: "Credenciales incorrectas"});
                }
        })
    },


};
 
module.exports = controladores;

