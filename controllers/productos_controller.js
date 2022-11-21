import { deleteAll_ChatPersistencia } from "../persistencia/chat_persistencia.js";
import { deleteAll_ProductosPersistencia} from "../persistencia/productos_persistencia.js";

export const initPorductosController = async (req, res) => {
    let login=null;
    if (req.session.user) {
        login=req.session.user
    }
    res.render('body',{login});
}


export const borrarProductosController = async (req, res) => {
    deleteAll_ProductosPersistencia();
    res.redirect("/api/productos")
}

export const borrarChatController = async (req, res) => {
    deleteAll_ChatPersistencia();
    res.redirect("/api/productos")
}