
import { DaosUsuariosMongo } from "../daos/daosUsuarios.js";
import { SchemaUsuario } from "../daos/mongo/models/Schemas.js";


export const usuarios = new DaosUsuariosMongo("usuarios",SchemaUsuario)
