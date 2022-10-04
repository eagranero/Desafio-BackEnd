import express, { json } from "express";
import DB from "../contenedores/sql/DB.js";
import Contenedor_FS from "../contenedores/fs/Contenedor_FS.js"
import {options as MDB}  from "../options/optionsMDB.js"


export const listadoProductos =  new DB("Productos",MDB);
export const listadoChat= new Contenedor_FS("chat")
export const routerProductos = express.Router()

//Direccion para cargar la pagina principal
routerProductos.get('/', async (req, res) => {
    let login=null;
    if (req.session.user) {
        login=req.session.user
    }
    res.render('body',{login});
});

//Direccion para borrar todos los productos de la base de datos
routerProductos.get('/borrarproductos', async (req, res) => {
    await listadoProductos.deleteAll()
    res.redirect("/api/productos")
});

//Direccion para borrar todos los productos de la base de datos
routerProductos.get('/borrarChat', async (req, res) => {
    await listadoChat.deleteAll()
    res.redirect("/api/productos")
});

