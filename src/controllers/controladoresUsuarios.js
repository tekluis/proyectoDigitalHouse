const fs = require("fs");
const path = require('path');                                           // habilita path
const bcrypt = require("bcryptjs");
const {validationResult} = require('express-validator');


 function cargarUsuarios(){
    const jsonData = fs.readFileSync(path.join(__dirname, "../data/users.json"));
    const data = JSON.parse(jsonData);
    return data
}

function salvarUsuarios(data){
    const dataString = JSON.stringify(data, null, 4);
    fs.writeFileSync(path.join(__dirname, "../data/users.json"), dataString);
 }


let controladores = {
    
    
    usersList: function(req,res) {
        const usuarios = cargarUsuarios();
        res.render(path.join(__dirname,'../views/users/usersList.ejs'), {usuario:usuarios});          // devuelve la página index.ejs al llamar a controlador.index
    },

    userDetail: function(req,res) {
        const usuarios = cargarUsuarios();
        let usuarioEncontrado = usuarios.find(usuarios => {
            return usuarios.id == req.params.id
        })
        res.render(path.join(__dirname,'../views/users/userDetail.ejs'), { user : usuarioEncontrado});
    },

    login:  function(req,res) {
        res.render(path.join(__dirname,'../views/users/login.ejs'));          // devuelve la página login.ejs al llamar a controlador.login
    },
    
    register:  function(req,res) {
        res.render(path.join(__dirname,'../views/users/register.ejs'));
    },

  
    
    crearUsuario: function(req,res) {
        const usuarios = cargarUsuarios();
        let errors=validationResult(req);

        if (errors.isEmpty() && req.file) {

            const nuevoUsuario = {
                id: usuarios[usuarios.length-1].id + 1,
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                categoria: req.body.categoria,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                imagen: req.file.filename
            }
            usuarios.push(nuevoUsuario);
            salvarUsuarios(usuarios);
            res.redirect('/user/list');                                              // envía a la página de home luego de cargar los datos del formulario

        } else {
                res.render(path.join(__dirname,'../views/users/register.ejs'), {errors:errors.mapped(), old:req.body});
        }

    },

    borrarUsuario: function(req,res) {
        const usuarios = cargarUsuarios();

        let indiceEncontrado = usuarios.findIndex(usuario => {
            return usuario.id == req.params.id
        })
 
        usuarios.splice(indiceEncontrado,1);

        salvarUsuarios(usuarios);

        res.redirect('/user/list');

    },

    salir: function(req,res) {
        req.session.destroy();
        res.clearCookie("recuerdame");
        res.redirect('/')
    },


    entrar: function(req,res) {

        const usuarios = cargarUsuarios();
        ingresar=false;

        for(i=0;i<usuarios.length;i++) {
            if((usuarios[i].email==req.body.email) && (bcrypt.compareSync(req.body.password,usuarios[i].password))) {
                indice=i;
                ingresar=true;
            }
        }
        if(ingresar==false) {
            res.render(path.join(__dirname,'../views/users/login.ejs'), {errorIngreso: "Credenciales incorrectas"});
        } else {
            req.session.usuarioLogeado = {
                id: usuarios[indice].id,
                nombre: usuarios[indice].nombre,
            }

            if(req.body.recordar) {
                res.cookie("recuerdame", usuarios[indice].id, {maxAge:5*60*1000});   // cookie por 5 minutos
            }

            res.redirect('/');
    //        res.send(req.session.usuarioLogeado.nombre);
    //        res.send(usuario);
        }
    },


};
 
module.exports = controladores;

