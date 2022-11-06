import express, { json } from "express";
//import DB from "../daos/sql/DB.js";
import Contenedor_FS from "../daos/fs/Contenedor_FS.js";
//import {options as MDB}  from "../options/optionsMDB.js"
import { SchemaProducto } from "../daos/mongo/models/Schemas.js";
import { DaosProductoMongo } from "../daos/daosProducto.js";


//export const listadoProductos =  new DB("Productos",MDB);
export const listadoProductos =  new DaosProductoMongo("productos",SchemaProducto)
export const listadoChat= new Contenedor_FS("chat")
export const routerProductos = express.Router()



function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  }
  

//Direccion para cargar la pagina principal
routerProductos.get('/',checkAuthentication, async (req, res) => {
    let login=null;
    if (req.session.user) {
        login=req.session.user
    }
    res.render('body',{login});
});

//Direccion para borrar todos los productos de la base de datos
routerProductos.get('/borrarproductos',checkAuthentication, async (req, res) => {
    await listadoProductos.deleteAll()
    res.redirect("/api/productos")
});

//Direccion para borrar todos los productos de la base de datos
routerProductos.get('/borrarChat',checkAuthentication, async (req, res) => {
    await listadoChat.deleteAll()
    res.redirect("/api/productos")
});

