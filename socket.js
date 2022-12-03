import { schema, normalize } from 'normalizr';
import { listadoChat } from './persistencia/chat_persistencia.js';
import { listadoProductos } from './persistencia/productos_persistencia.js';

const authorSchema = new schema.Entity("authors", {},{idAttribute:'mail'})
const schemaMensaje = new schema.Entity("post", {author:authorSchema},{idAttribute:'id'})
const schemaPosteos = new schema.Entity('posts', { mensajes: [schemaMensaje] }, { idAttribute: 'id' })

let chat=[],chatNorm={};
let chat_a_normalizar={id:"chat",mensajes:[]};


export const socket=(io)=>{
    io.on("connection", async (socket) => {

        chat = await listadoChat.getAll();

        let date = new Date();
        //io.sockets.emit("listadoProductos", await listadoProductos.getAll_Knex());
        io.sockets.emit("listadoProductos", await listadoProductos.getAll());

        const tiempo = "["+date.toLocaleDateString() + " - " + date.toLocaleTimeString()+"]";
        let nuevaConexion={author:{mail:"Nuevo",tiempo:tiempo,nombre:"",apellido:"",edad:"",alias:"",avatar:""},text: "Se unio al chat " + socket.id}
        chat.push(nuevaConexion)
        listadoChat.save(nuevaConexion);

        chat_a_normalizar.mensajes=JSON.parse(JSON.stringify(chat))
        chatNorm=normalize(chat_a_normalizar,schemaPosteos)
        
        io.sockets.emit("listadoChat", chatNorm);

        socket.on("msg-chat", async (data) => {
            listadoChat.save(data);
            chat = await listadoChat.getAll();
            chat_a_normalizar.mensajes=JSON.parse(JSON.stringify(chat))
            chatNorm=normalize(chat_a_normalizar,schemaPosteos)  
            io.sockets.emit("listadoChat", chatNorm);
        });

        socket.on("nuevoProducto",async (data) => {
            console.log(data);
            await listadoProductos.save(data) //agrego producto al archivo
            io.sockets.emit("listadoProductos", await listadoProductos.getAll());
        });
    });

}