
const db = require ('../../database/models')
const { Op } = require("sequelize");

const fs = require("fs");
const path = require('path');                                           // habilita path
const bcrypt = require("bcryptjs");
const {validationResult} = require('express-validator');

function cargarProductos(){
    const jsonData = fs.readFileSync(path.join(__dirname, "../data/products.json"));
    const data = JSON.parse(jsonData);
    return data
}


function salvarProductos(data){
    const dataString = JSON.stringify(data, null, 4);
    fs.writeFileSync(path.join(__dirname, "../data/products.json"), dataString);
}

function cargarCarrito(){
    const jsonData = fs.readFileSync(path.join(__dirname, "../data/carrito.json"));
    const data = JSON.parse(jsonData);
    return data
}

function salvarCarrito(data){
    const dataString = JSON.stringify(data, null, 4);
    fs.writeFileSync(path.join(__dirname, "../data/carrito.json"), dataString);
 }

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
        const carritos = cargarCarrito();
        res.render(path.join(__dirname,'../views/products/productCart.ejs'), {carrito:carritos});
    },        


    crearProducto: function(req,res) {
        let errors=validationResult(req);
        if (errors.isEmpty() && req.file) {
            db.products.create({
                nombre: req.body.nombre,
                precio: req.body.precio,
                categoria: req.body.categoria,
                tamano: req.body.tamano,
                descuento: req.body.descuento,
                imagen: req.file.filename 
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
        const carritos = cargarCarrito();

        let indiceEncontrado = carritos.findIndex(carrito => {
            return carrito.id == req.params.id
        })

        carritos.splice(indiceEncontrado,1);
        salvarCarrito(carritos);
        res.redirect('/product/cart');
    },

    finalizarCompra: function(req,res) {
        let datos_entrar=req.body;
        //res.send(datos_entrar);
        res.redirect('/product/list');
    },

    agregarCarrito: function(req,res) {
        const plantas = cargarProductos();
        const carritos = cargarCarrito();

        let plantaEncontrada = plantas.find(planta => {
            return planta.id == req.params.id
        })

        carritos.push(plantaEncontrada);

        res.redirect('/product/cart');

        salvarCarrito(carritos);
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

