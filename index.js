import  fs  from 'fs'
import DB from "./DB.js";
import express from "express";
import { createServer, get } from "http";
import { Server } from "socket.io";
import {engine} from "express-handlebars"
import {options as MDB}  from "./options/optionsMDB.js"
import {options as SQLite}  from "./options/optionsSQLite.js"

// Creo las DB de Productos y Chat
const listadoProductos =  new DB("Productos",MDB);
listadoProductos.crearDBProductos();
const listadoChat =  new DB("Chat",SQLite);
listadoChat.crearDBChat();

//Cargo 3 productos de prueba
listadoProductos.save_Knex({nombre:"Escuadra", precio:123.45, thumbnail:"../img/escuadra.jpg"})
listadoProductos.save_Knex({nombre:"Calculadora", precio:123.45, thumbnail:"../img/calculadora.jpg"});
listadoProductos.save_Knex({nombre:"Cuaderno", precio:123.45, thumbnail:"../img/cuaderno.jpg"});


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


let chat;

io.on("connection", async (socket) => {

    chat = await listadoChat.getAll_Knex();
    
    
    io.sockets.emit("listadoProductos", await listadoProductos.getAll_Knex());
    let nuevaConexion={mail:"",tiempo:"",msg: "Se unio al chat " + socket.id}
    chat.push(nuevaConexion);
    listadoChat.save_Knex(nuevaConexion);
    io.sockets.emit("listadoChat", chat);

    socket.on("msg-chat", (data) => {
    chat.push(data);
    io.sockets.emit("listadoChat", chat);
    listadoChat.save_Knex(data);
  });

socket.on("nuevoProducto",async (data) => {
    console.log(data);
    await listadoProductos.save_Knex(data) //agrego producto al archivo
    io.sockets.emit("listadoProductos", await listadoProductos.getAll_Knex());
  });
});
