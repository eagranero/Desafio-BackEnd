
import config from "../config.js";
import UsuariosFactoryDAO from "../daos/daosUsuarios.js";

export const usuarios= new UsuariosFactoryDAO(config.TIPO_PERSISTENCIA,"usuarios")

