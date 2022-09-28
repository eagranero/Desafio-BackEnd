import  fs  from 'fs'
import DB from "./DB.js";
import express from "express";
import { createServer, get } from "http";
import { Server } from "socket.io";
import {engine} from "express-handlebars"
import {options as MDB}  from "./options/optionsMDB.js"
import {options as SQLite}  from "./options/optionsSQLite.js"

import { generarProducto } from './utils/generadorProductos.js';
import Contenedor_FS from "./fs/Contenedor_FS.js"
import { schema, normalize } from 'normalizr';
import util from 'util'


// Creo las DB de Productos y Chat
const listadoProductos =  new DB("Productos",MDB);
listadoProductos.crearDBProductos();
//const listadoChat =  new DB("Chat",SQLite);
//listadoChat.crearDBChat();
const listadoChat= new Contenedor_FS("chat")

//Cargo 3 productos de prueba
const asincronica=(async()=>{
    await listadoProductos.deleteAll()
    //await listadoChat.deleteAll()
    await listadoProductos.save_Knex({nombre:"Escuadra", precio:123.45, thumbnail:"../img/escuadra.jpg"})
    await listadoProductos.save_Knex({nombre:"Calculadora", precio:123.45, thumbnail:"../img/calculadora.jpg"});
    await listadoProductos.save_Knex({nombre:"Cuaderno", precio:123.45, thumbnail:"../img/cuaderno.jpg"});
})()






//Inicio Servidor Express
const app = express();
const router = express.Router();

const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 8080

httpServer.listen(PORT,()=>{
    console.log("Servidor Encendido")
})

httpServer.on("error",(error)=>{console.log("Error en servidor")})

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/api/productos',router)

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: './views/layouts',
        partialsDir: './views/partials',
    })
);

let listadoProductosTest=[]

const routerProductostest = express.Router()
app.use('/api/productos-test',routerProductostest);

routerProductostest.get('/', async (req, res) => {
    listadoProductosTest=[]
    for(let i=0;i<5;++i)listadoProductosTest.push(generarProducto())
    res.render('productos-test')
});


//Direccion para cargar la pagina principal
app.get('/', async (req, res) => {
    res.render('body');
});

//Direccion para borrar todos los productos de la base de datos
app.get('/borrarproductos', async (req, res) => {
    await listadoProductos.deleteAll()
    res.render('body');
});

//Direccion para borrar todos los productos de la base de datos
app.get('/borrarChat', async (req, res) => {
    await listadoChat.deleteAll()
    res.render('body');
});



const authorSchema = new schema.Entity("authors", {},{idAttribute:'mail'})
const schemaMensaje = new schema.Entity("post", {author:authorSchema},{idAttribute:'id'})
const schemaPosteos = new schema.Entity('posts', { mensajes: [schemaMensaje] }, { idAttribute: 'id' })

let chat=[],chatNorm={};
let chat_a_normalizar={id:"chat",mensajes:[]};

io.on("connection", async (socket) => {

    chat = await listadoChat.getAll();

    let date = new Date();
    io.sockets.emit("listadoProductos-test", listadoProductosTest );
    io.sockets.emit("listadoProductos", await listadoProductos.getAll_Knex());
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
        await listadoProductos.save_Knex(data) //agrego producto al archivo
        io.sockets.emit("listadoProductos", await listadoProductos.getAll_Knex());
    });
});
