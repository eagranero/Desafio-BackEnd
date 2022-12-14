import Contenedor_FS from "./fs/Contenedor_FS.js";
//import Contenedor_Mongo, { connectMG } from "./mongo/Contenedor_Mongo.js";
//import { SchemaProducto } from "./mongo/models/Schemas.js";


export default class ProductosFactoryDAO {
    constructor(tipo,nombre){
        switch (tipo) {
            case "FILE":
                return new DaosProductoFS(nombre);
            case "MONGO":
 //               connectMG("Productos");
 //               return new DaosProductoMongo("productos",SchemaProducto)
            default:
 //               return new DaosProductoMongo("productos",SchemaProducto);
        }
    }
}


/*
class DaosProductoMongo extends Contenedor_Mongo{
    constructor(nombre,schema){
        super(nombre,schema)
    }
}*/

class DaosProductoFS extends Contenedor_FS{
    constructor(nombre){
        super(nombre)
    }
}



