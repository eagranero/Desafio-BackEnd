import express from "express";
import { generarProducto } from '../utils/generadorProductos.js';

export const routerProductostest = express.Router()
export const listadoProductosTest=[]

routerProductostest.get('/', async (req, res) => {
    listadoProductosTest=[]
    for(let i=0;i<5;++i)listadoProductosTest.push(generarProducto())
    res.render('productos-test')
});