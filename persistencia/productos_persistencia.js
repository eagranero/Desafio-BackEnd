import ProductosFactoryDAO from "../daos/daosProducto.js";

export const listadoProductos= new ProductosFactoryDAO("FILE","productos")

export const deleteAll_ProductosPersistencia= async ()=>{
    await listadoProductos.deleteAll()
}
