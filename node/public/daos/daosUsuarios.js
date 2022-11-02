import Contenedor_Mongo, { connectMG } from "./mongo/Contenedor_Mongo.js";

connectMG("Usuarios");

export class DaosUsuariosMongo extends Contenedor_Mongo{
    constructor(nombre,schema){
        super(nombre,schema)
    }
}

