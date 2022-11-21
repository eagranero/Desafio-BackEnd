import Contenedor_FS from "../daos/fs/Contenedor_FS.js";

export const listadoChat= new Contenedor_FS("chat")

export const deleteAll_ChatPersistencia= async ()=>{
    await listadoChat.deleteAll()
}
