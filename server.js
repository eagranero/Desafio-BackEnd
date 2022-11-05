import express from "express";
import { createServer, get } from "http";
import { Server } from "socket.io";
import {engine} from "express-handlebars"
import { routerProductos,listadoProductos } from "./routers/productos.js";
import { routerProductostest } from "./routers/productos-test.js";
import {socket} from "./socket.js"
import session from "express-session"
import MongoStore from "connect-mongo";
import { routerLogin } from "./routers/login.js";
import passport from "passport";
import dotenv from 'dotenv'
import Yargs from "yargs";
import { randoms } from "./routers/randoms.js";
import cluster from "cluster";
import numCPUs from "os"
import compression from "compression"
import logger from "./utils/logger.js"



//logger.info("algo")

dotenv.config()

//Cargo 3 productos de prueba
/*const asincronica=(async()=>{
    listadoProductos.crearDBProductos();
    await listadoProductos.deleteAll()
    //await listadoChat.deleteAll()
    await listadoProductos.save_Knex({nombre:"Escuadra", precio:123.45, thumbnail:"../img/escuadra.jpg"})
    await listadoProductos.save_Knex({nombre:"Calculadora", precio:123.45, thumbnail:"../img/calculadora.jpg"});
    await listadoProductos.save_Knex({nombre:"Cuaderno", precio:123.45, thumbnail:"../img/cuaderno.jpg"});
})()*/




//Inicio Servidor Express
const app = express();
app.use(compression())
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_CONNECTION_STRING,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),

    secret: process.env.SECRET_MONGO,
    cookie: {maxAge: 10000},
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static('public'));
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


app.use(passport.initialize());
app.use(passport.session());
app.use(express.json())
app.use(express.urlencoded({extended:true}));
  
  
const httpServer = createServer(app);
const io = new Server(httpServer);
//const PORT = process.env.PORT || 8080
const args = Yargs(process.argv.slice(2)).default({port:8000,modo:"fork"}).argv
const PORT=args.port;

//const PORT=8080


if (cluster.isPrimary && args.modo=="cluster") {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs.cpus().length; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    cluster.fork();
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  httpServer.listen(PORT,()=>{
    console.log("Servidor Encendido en puerto "+ PORT)
  })
  httpServer.on("error",(error)=>{console.log("Error en servidor")})
  console.log(`Worker ${process.pid} started`);
}


app.use(function(req,res,next){
  req.session._garbage = Date();
  req.session.touch();
  next()
})

app.use(function (req, res, next) {
  logger.info(req.method + " " + req.url);
  next();
});

app.use('/api/productos',routerProductos);
app.use('/api/productos-test',routerProductostest);
app.use('/api/randoms',randoms);
app.use('/login',routerLogin);

app.get('/', async (req, res) => {
  if (req.session.user) res.redirect("/login")
  else res.redirect("/login")
});


app.get("/info",(req,res)=>{
  const informacion = {
    Argumentos: args,
    Plataforma: process.platform,
    ID: process.pid,
    Version: process.version,
    Memoria:process.memoryUsage(),
    Path:process.execPath,
    Carpeta: process.cwd()
  }
  console.log(informacion)//esta es la linea que agrego
  res.json(informacion);
  //res.send("asdasd".repeat(1000))
})

app.get('*', (req, res)=>{
  logger.warn(req.method + " " + req.url);
  

  res.status(404).send('sitio no encotrado');
});

socket(io)








