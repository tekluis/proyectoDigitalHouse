const db = require ('../../database/models')
const { Op } = require("sequelize");

const fs = require("fs");
const path = require('path');                                           // habilita path
const {validationResult} = require('express-validator');

let controladores = {

    index: function(req,res) {
        db.products.findAll({
                order:[['id','ASC']],
                offset:0,
                limit:100
            })
            .then((plantas) => {
                res.render(path.join(__dirname,'../views/index.ejs'), {planta:plantas}); 
            })
    },


    productList: function(req,res) {
        db.products.findAll({
                order:[['id','ASC']],
                offset:0,
                limit:100
            })
            .then((plantas) => {
                res.render(path.join(__dirname,'../views/products/productList.ejs'), {planta:plantas}); 
            })
    },

    plantasList: function(req,res) {
        db.products.findAll({
                where:{categoria:"planta"}
            })
            .then((plantas) => {
                res.render(path.join(__dirname,'../views/products/productList.ejs'), {planta:plantas}); 
            })
    },

    macetasList: function(req,res) {
        db.products.findAll({
                where:{categoria:"maceta"}
            })
            .then((plantas) => {
                res.render(path.join(__dirname,'../views/products/productList.ejs'), {planta:plantas}); 
            })
    },
    
    
    productDetail: function(req,res) {
        db.products.findByPk(req.params.id)
            .then((plantaEncontrada) => {
                res.render(path.join(__dirname,'../views/products/productDetail.ejs'), {planta:plantaEncontrada}); 
            })
    },

    productCreate:  function(req,res) {
        res.render(path.join(__dirname,'../views/products/productCreate.ejs'));
    },

    productCart:  function(req,res) {
        
        db.carrito.findAll({
            include:['products'],
            where:{id_users:req.session.usuarioLogeado.id},
            order:[['id_products','ASC']]
        })
        .then((carritos) => {
            let listado=[];
            for(let i=0; i<carritos.length; i++){
                let {products}=carritos[i];
                listado.push(products)
            }

            res.render(path.join(__dirname,'../views/products/productCart.ejs'), {carrito:listado}); 
        })

    },        

    crearProducto: function(req,res) {
        let errors=validationResult(req);
        if (errors.isEmpty()) {
            db.products.create({
                nombre: req.body.nombre,
                precio: req.body.precio,
                categoria: req.body.categoria,
                tamano: req.body.tamano,
                descuento: req.body.descuento,
                imagen: req.file ? req.file.filename : "plant.jpeg"
            })
            .then(res.redirect('/product/list'));                                              // envía a la página de home luego de cargar los datos del formulario

        } else {
            res.render(path.join(__dirname,'../views/products/productCreate.ejs'), {errors:errors.mapped(), old:req.body});
        }

    },

    actualizarProducto : function(req,res) {

        if (req.file) {
            db.products.update ({
                nombre: req.body.nombre,
                precio: req.body.precio,
                categoria: req.body.categoria,
                tamano: req.body.tamano,
                descuento: req.body.descuento,
                imagen: req.file.filename
            },{
                where: {id:req.params.id}
            })
            .then(res.redirect('/product/list'));                                              // envía a la página de home luego de cargar los datos del formulario

        }else{
            db.products.update ({
                nombre: req.body.nombre,
                precio: req.body.precio,
                categoria: req.body.categoria,
                tamano: req.body.tamano,
                descuento: req.body.descuento,
                // imagen: req.file.filename
            },{
                where: {id:req.params.id}
            })
            .then(res.redirect('/product/list'));                                              // envía a la página de home luego de cargar los datos del formulario
        }
    },

    borrarProducto: function(req,res) {
        db.products.destroy ({
            where: {id:req.params.id}
        })
        .then(res.redirect('/product/list'));
    },

    borrarCarrito: function(req,res) {
        db.carrito.findOne({
            where: [
                        {id_users: req.session.usuarioLogeado.id},
                        {id_products: req.params.id}
                    ]
        })
        .then(carrito => {
            console.log(carrito.id);
            db.carrito.destroy ({
                where: [
                    {id:carrito.id}
                ]
            })
        })
        .then(res.redirect('/product/cart'));


    },

    finalizarCompra: function(req,res) {
        let datos_entrar=req.body;
        //res.send(datos_entrar);
        res.redirect('/product/list');
    },

    agregarCarrito: function(req,res) {

        db.carrito.create({
            id_users: req.session.usuarioLogeado.id,
            id_products: req.params.id
        })
        .then(res.redirect('/product/cart'));  

    },


    // productEdit: function(req,res){
    //     const plantas = cargarProductos();
    //     let plantaEncontrada = plantas.find(planta => {
    //         return planta.id == req.params.id
    //     })
    //     res.render(path.join(__dirname,'../views/products/productEdit.ejs'), { planta : plantaEncontrada});
    // },
 
    productEdit: function(req,res){
        db.products.findByPk(req.params.id)
            .then((plantaEncontrada) => {
                res.render(path.join(__dirname,'../views/products/productEdit.ejs'), {planta:plantaEncontrada}); 
            })
    },

    comprar:  function(req,res) {
        res.send("Página de comprar");   
    },
};
 
module.exports = controladores;

