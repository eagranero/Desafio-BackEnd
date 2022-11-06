import Contenedor_Mongo, { connectMG } from "./mongo/Contenedor_Mongo.js";

connectMG("Productos");

export class DaosProductoMongo extends Contenedor_Mongo{
    constructor(nombre,schema){
        super(nombre,schema)
    }
}