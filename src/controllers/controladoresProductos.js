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
        const plantas = cargarProductos();
        res.render(path.join(__dirname,'../views/index.ejs'), {planta:plantas});          // devuelve la página index.ejs al llamar a controlador.index
    },
    
    productList: function(req,res) {
        const plantas = cargarProductos();
        res.render(path.join(__dirname,'../views/products/productList.ejs'), {planta:plantas});          // devuelve la página index.ejs al llamar a controlador.index
    },

    productCart:  function(req,res) {
        const carritos = cargarCarrito();
        res.render(path.join(__dirname,'../views/products/productCart.ejs'), {carrito:carritos});
    },

    productDetail:  function(req,res) {
        const plantas = cargarProductos();
        let plantaEncontrada = plantas.find(planta => {
            return planta.id == req.params.id
        })
        res.render(path.join(__dirname,'../views/products/ProductDetail.ejs'), { planta : plantaEncontrada});
    },



    productCreate:  function(req,res) {
        res.render(path.join(__dirname,'../views/products/productCreate.ejs'));
    },

    crearProducto: function(req,res) {
        const plantas = cargarProductos();
        let errors=validationResult(req);

        if (errors.isEmpty() && req.file) {

            const nuevaPlanta = {
                id: plantas[plantas.length-1].id + 1,
                nombre: req.body.nombre,
                precio: req.body.precio,
                categoria: req.body.categoria,
                tamano: req.body.tamano,
                descuento: req.body.descuento,
                imagen: req.file.filename
            }
            plantas.push(nuevaPlanta);
            salvarProductos(plantas);
            res.redirect('/product/list');                                              // envía a la página de home luego de cargar los datos del formulario

        } else {
            res.render(path.join(__dirname,'../views/products/productCreate.ejs'), {errors:errors.mapped(), old:req.body});
        }

    },


    actualizarProducto : function(req,res) {
        const plantas = cargarProductos();

        let plantaEncontrada = plantas.find(planta => {
            return planta.id == req.params.id
        })

        plantaEncontrada.nombre=req.body.nombre;
        plantaEncontrada.precio=req.body.precio;
        plantaEncontrada.categoria=req.body.categoria;
        plantaEncontrada.tamano=req.body.tamano;
        plantaEncontrada.descuento=req.body.descuento;
        if (req.file) {
            plantaEncontrada.imagen=req.file.filename;
        }

        salvarProductos(plantas);

        res.redirect('/product/list');                                              // envía a la página de home luego de cargar los datos del formulario

    },

    borrarProducto: function(req,res) {
        const plantas = cargarProductos();
        
        let indiceEncontrado = plantas.findIndex(planta => {
            return planta.id == req.params.id
        })

        plantas.splice(indiceEncontrado,1);

        salvarProductos(plantas);

        res.redirect('/product/list');

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

 
    productEdit: function(req,res){
        const plantas = cargarProductos();
        let plantaEncontrada = plantas.find(planta => {
            return planta.id == req.params.id
        })
        res.render(path.join(__dirname,'../views/products/productEdit.ejs'), { planta : plantaEncontrada});
    },

    comprar:  function(req,res) {
        res.send("Página de comprar");   
    },
};
 
module.exports = controladores;

