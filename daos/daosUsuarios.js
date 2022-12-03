import Contenedor_FS from "./fs/Contenedor_FS.js";
import Contenedor_Mongo, { connectMG } from "./mongo/Contenedor_Mongo.js";
import { SchemaUsuario } from "./mongo/models/Schemas.js";

connectMG("Usuarios");

export default class UsuariosFactoryDAO{
    constructor(tipo,nombre){
        switch (tipo) {
            case "FILE":
                return new DaosUsuariosFS(nombre);
            case "MONGO":
                connectMG("Productos");
                return new DaosUsuariosMongo("usuarios",SchemaUsuario)
            default:
                connectMG("Productos");
                return new DaosUsuariosMongo("usuarios",SchemaUsuario);
        }
    }
}



class DaosUsuariosMongo extends Contenedor_Mongo{
    constructor(nombre,schema){
        super(nombre,schema)
    }
}

class DaosUsuariosFS extends Contenedor_FS{
    constructor(nombre){
        super(nombre)
    }
    buscar(criterio){
        let encontrado=null
        if(criterio.username){
            this.getAll()
            this.listado.forEach(element => {
                if (element.username==criterio.username){
                    encontrado=element
                }
            });
        }
        return encontrado
    }
}

