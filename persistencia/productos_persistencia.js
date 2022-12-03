import ProductosFactoryDAO from "../daos/daosProducto.js";

export const listadoProductos= new ProductosFactoryDAO(process.env.TIPO_PERSISTENCIA,"productos")

export const deleteAll_ProductosPersistencia= async ()=>{
    await listadoProductos.deleteAll()
}
