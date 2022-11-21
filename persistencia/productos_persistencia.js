import Contenedor_FS from "../daos/fs/Contenedor_FS.js";
import { SchemaProducto } from "../daos/mongo/models/Schemas.js";
import { DaosProductoMongo } from "../daos/daosProducto.js";


export const listadoProductos =  new DaosProductoMongo("productos",SchemaProducto)
export const listadoChat= new Contenedor_FS("chat")

export const deleteAll_ProductosPersistencia= async ()=>{
    await listadoProductos.deleteAll()
}
