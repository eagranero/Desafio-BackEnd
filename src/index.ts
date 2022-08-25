import express from "express";
import { getTime } from "./lib/utils";
import Productos from "./Productos";





const stock: Productos = new Productos("listado.txt")

stock.getAll();
console.log(stock.listado)
stock.deleteAll();
console.log(stock.listado)
stock.save("Producto 1",100,"www.1.com");
stock.save("Producto 2",100,"www.2.com");
stock.save("Producto 3",100,"www.3.com");
stock.save("Producto 4",100,"www.4.com");
console.log(stock.listado)
stock.deleteByID(3);
stock.getAll();
console.log(stock.listado)

//Inicio Servidor Express
const app = express();
const router = express.Router();

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
const PORT = process.env.PORT || 8080


httpServer.listen(PORT,()=>{
    console.log("Servidor Encendido")
})

httpServer.on("error",(error)=>{console.log("Error en servidor")})

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/api/productos',router)


//Direccion para cargar el formulario
app.get('/', (req, res) => {
  res.json(stock.listado);
});

