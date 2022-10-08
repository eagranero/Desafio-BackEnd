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

//Cargo 3 productos de prueba
const asincronica=(async()=>{
    listadoProductos.crearDBProductos();
    await listadoProductos.deleteAll()
    //await listadoChat.deleteAll()
    await listadoProductos.save_Knex({nombre:"Escuadra", precio:123.45, thumbnail:"../img/escuadra.jpg"})
    await listadoProductos.save_Knex({nombre:"Calculadora", precio:123.45, thumbnail:"../img/calculadora.jpg"});
    await listadoProductos.save_Knex({nombre:"Cuaderno", precio:123.45, thumbnail:"../img/cuaderno.jpg"});
})()




//Inicio Servidor Express
const app = express();
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://eduardo:123456a@cluster0.fbnxtxd.mongodb.net",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),

    secret: "el secreto",
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
const PORT = process.env.PORT || 8080

httpServer.listen(PORT,()=>{
    console.log("Servidor Encendido")
})

httpServer.on("error",(error)=>{console.log("Error en servidor")})

app.use(function(req,res,next){
  req.session._garbage = Date();
  req.session.touch();
  next()
})

app.use('/api/productos',routerProductos);
app.use('/api/productos-test',routerProductostest);
app.use('/login',routerLogin);

app.get('/', async (req, res) => {
  if (req.session.user) res.redirect("/login")
  else res.redirect("/login")
});

socket(io)