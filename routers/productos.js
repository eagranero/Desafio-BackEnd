import express from "express";
import { borrarChatController, borrarProductosController, initPorductosController } from "../controllers/productos_controller.js";
import { checkAuthentication } from "../utils/auth.js";

export const routerProductos = express.Router()

//Direccion para cargar la pagina principal
routerProductos.get('/',checkAuthentication, initPorductosController);

//Direccion para borrar todos los productos de la base de datos
routerProductos.get('/borrarproductos',checkAuthentication, borrarProductosController);

//Direccion para borrar todos los productos de la base de datos
routerProductos.get('/borrarChat',checkAuthentication, borrarChatController);

